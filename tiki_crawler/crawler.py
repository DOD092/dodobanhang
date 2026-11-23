"""Điều phối crawl: listing → chi tiết sản phẩm (đa luồng) → review (tuỳ chọn)."""
from __future__ import annotations

import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Callable, Iterator

from .api import TikiAPI
from .checkpoint import Checkpoint
from .client import TikiClient, TikiHTTPError
from .config import Settings
from .models import Category, Product, ProductSummary, Review
from .storage import Storage, make_storage

log = logging.getLogger(__name__)


class TikiCrawler:
    def __init__(self, settings: Settings | None = None, storage: Storage | None = None):
        self.settings = settings or Settings()
        self.api = TikiAPI(TikiClient(self.settings))
        self.storage = storage or make_storage(self.settings.storage, self.settings.output_dir)
        self.checkpoint = Checkpoint(self.settings.output_dir / "checkpoint.json")
        self.stats = {"summaries": 0, "products": 0, "reviews": 0, "errors": 0}

    # ------------------------------------------------------------------ categories
    def crawl_categories(self, root_id: int | None = None, recursive: bool = True,
                         max_depth: int = 3) -> list[Category]:
        result: list[Category] = []
        queue: list[tuple[int | None, int]] = [(root_id, 0)]
        while queue:
            parent, depth = queue.pop(0)
            try:
                data = self.api.categories(parent)
            except TikiHTTPError as exc:
                log.error("Không lấy được category con của %s: %s", parent, exc)
                continue
            for raw in data.get("data", []):
                cat = Category.from_api(raw)
                result.append(cat)
                if recursive and not cat.is_leaf and depth + 1 < max_depth:
                    queue.append((cat.id, depth + 1))
        self.storage.save(result)
        log.info("Đã lưu %d category", len(result))
        return result

    # ------------------------------------------------------------------ listing
    def _paginate(self, fetch: Callable[[int], dict], key: str, max_pages: int,
                  category_id: int | None, resume: bool) -> Iterator[ProductSummary]:
        start = self.checkpoint.last_page(key) + 1 if resume else 1
        for page in range(start, max_pages + 1):
            try:
                data = fetch(page)
            except TikiHTTPError as exc:
                log.error("Lỗi listing %s trang %d: %s", key, page, exc)
                self.stats["errors"] += 1
                break
            items = data.get("data") or []
            if not items:
                break
            summaries = [ProductSummary.from_api(i, category_id) for i in items if i.get("id")]
            self.storage.save(summaries)
            self.stats["summaries"] += len(summaries)
            log.info("[%s] trang %d: %d sản phẩm", key, page, len(summaries))
            yield from summaries
            self.checkpoint.mark_page(key, page)
            last_page = (data.get("paging") or {}).get("last_page")
            if last_page and page >= last_page:
                break

    def iter_category(self, category_id: int, max_pages: int | None = None,
                      url_key: str | None = None, sort: str | None = None,
                      resume: bool = True) -> Iterator[ProductSummary]:
        s = self.settings
        return self._paginate(
            lambda p: self.api.listing(category_id, p, s.page_size, url_key, sort),
            f"category:{category_id}:{sort or 'default'}", max_pages or s.max_pages, category_id, resume,
        )

    def iter_search(self, keyword: str, max_pages: int | None = None,
                    resume: bool = True) -> Iterator[ProductSummary]:
        s = self.settings
        return self._paginate(
            lambda p: self.api.search(keyword, p, s.page_size),
            f"search:{keyword}", max_pages or s.max_pages, None, resume,
        )

    # ------------------------------------------------------------------ detail
    def fetch_product(self, product_id: int, spid: int | None = None,
                      with_reviews: bool = False, seller_id: int | None = None) -> Product | None:
        try:
            raw = self.api.product(product_id, spid)
        except TikiHTTPError as exc:
            log.error("Lỗi sản phẩm %s: %s", product_id, exc)
            self.stats["errors"] += 1
            return None
        if self.settings.save_raw:
            raw_dir = self.settings.output_dir / "raw"
            raw_dir.mkdir(exist_ok=True)
            (raw_dir / f"{product_id}.json").write_text(json.dumps(raw, ensure_ascii=False), encoding="utf-8")

        product = Product.from_api(raw)
        self.storage.save([product])
        self.stats["products"] += 1
        if with_reviews and (product.review_count or 0) > 0:
            self.fetch_reviews(product.id, product.spid or spid, product.seller_id or seller_id)
        self.checkpoint.mark_done(product_id)
        return product

    def fetch_reviews(self, product_id: int, spid: int | None = None,
                      seller_id: int | None = None) -> list[Review]:
        s = self.settings
        out: list[Review] = []
        for page in range(1, s.max_review_pages + 1):
            try:
                data = self.api.reviews(product_id, page, s.review_page_size, spid, seller_id)
            except TikiHTTPError as exc:
                log.error("Lỗi review %s trang %d: %s", product_id, page, exc)
                self.stats["errors"] += 1
                break
            items = [Review.from_api(r, product_id) for r in data.get("data") or [] if r.get("id")]
            if not items:
                break
            self.storage.save(items)
            out.extend(items)
            last_page = (data.get("paging") or {}).get("last_page")
            if last_page and page >= last_page:
                break
        self.stats["reviews"] += len(out)
        return out

    def crawl_details(self, summaries: Iterator[ProductSummary], with_reviews: bool = False,
                      skip_done: bool = True) -> None:
        """Lấy chi tiết song song khi listing vẫn đang chạy (stream)."""
        seen: set[int] = set()
        with ThreadPoolExecutor(max_workers=self.settings.workers) as pool:
            futures = []
            for s in summaries:
                if s.id in seen or (skip_done and self.checkpoint.is_done(s.id)):
                    continue
                seen.add(s.id)
                futures.append(pool.submit(self.fetch_product, s.id, s.spid, with_reviews, s.seller_id))
            for f in as_completed(futures):
                try:
                    f.result()
                except Exception:  # không để 1 sản phẩm lỗi làm sập cả job
                    log.exception("Lỗi không mong muốn")
                    self.stats["errors"] += 1
        self.checkpoint.flush()

    # ------------------------------------------------------------------ lifecycle
    def close(self) -> None:
        self.checkpoint.flush()
        self.storage.close()
        log.info("Thống kê: %s", self.stats)

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()

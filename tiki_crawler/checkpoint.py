"""Checkpoint đơn giản để resume: lưu ID sản phẩm đã crawl và trang listing đã xong."""
from __future__ import annotations

import json
import threading
from pathlib import Path


class Checkpoint:
    def __init__(self, path: Path):
        self.path = Path(path)
        self._lock = threading.Lock()
        self.done_products: set[int] = set()
        self.done_pages: dict[str, int] = {}  # "category:123" -> trang cuối đã xong
        if self.path.exists():
            data = json.loads(self.path.read_text(encoding="utf-8"))
            self.done_products = set(data.get("done_products", []))
            self.done_pages = data.get("done_pages", {})

    def is_done(self, product_id: int) -> bool:
        return product_id in self.done_products

    def mark_done(self, product_id: int) -> None:
        with self._lock:
            self.done_products.add(product_id)

    def last_page(self, key: str) -> int:
        return self.done_pages.get(key, 0)

    def mark_page(self, key: str, page: int) -> None:
        with self._lock:
            self.done_pages[key] = max(page, self.done_pages.get(key, 0))
        self.flush()

    def flush(self) -> None:
        with self._lock:
            tmp = self.path.with_suffix(".tmp")
            tmp.write_text(json.dumps({
                "done_products": sorted(self.done_products),
                "done_pages": self.done_pages,
            }), encoding="utf-8")
            tmp.replace(self.path)

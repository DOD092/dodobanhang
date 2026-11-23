"""Giao diện dòng lệnh.

Ví dụ:
    python -m tiki_crawler categories --root 1789
    python -m tiki_crawler category 1795 --pages 3 --details --reviews
    python -m tiki_crawler search "tai nghe bluetooth" --pages 2 --details
    python -m tiki_crawler product 184059211 --reviews
"""
from __future__ import annotations

import argparse
import logging
import sys

from .config import Settings
from .crawler import TikiCrawler


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="tiki_crawler", description="Crawler dữ liệu Tiki.vn")
    p.add_argument("--output", default=None, help="Thư mục output (mặc định: data)")
    p.add_argument("--storage", choices=["jsonl", "csv", "sqlite"], default=None)
    p.add_argument("--workers", type=int, default=None)
    p.add_argument("--delay", type=float, default=None, help="Giây tối thiểu giữa 2 request")
    p.add_argument("--save-raw", action="store_true", help="Lưu JSON gốc của từng sản phẩm")
    p.add_argument("--no-resume", action="store_true", help="Bỏ qua checkpoint, crawl lại từ đầu")
    p.add_argument("-v", "--verbose", action="store_true")

    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("categories", help="Crawl cây danh mục")
    c.add_argument("--root", type=int, default=None, help="ID danh mục gốc")
    c.add_argument("--depth", type=int, default=3)

    l = sub.add_parser("category", help="Crawl sản phẩm theo danh mục")
    l.add_argument("category_id", type=int, nargs="+")
    l.add_argument("--pages", type=int, default=None)
    l.add_argument("--sort", default=None, help="top_seller | newest | price,asc | price,desc ...")
    l.add_argument("--details", action="store_true", help="Lấy cả chi tiết sản phẩm")
    l.add_argument("--reviews", action="store_true", help="Lấy cả review (cần --details)")

    s = sub.add_parser("search", help="Crawl theo từ khoá")
    s.add_argument("keyword")
    s.add_argument("--pages", type=int, default=None)
    s.add_argument("--details", action="store_true")
    s.add_argument("--reviews", action="store_true")

    d = sub.add_parser("product", help="Crawl chi tiết 1 hoặc nhiều sản phẩm theo ID")
    d.add_argument("product_id", type=int, nargs="+")
    d.add_argument("--reviews", action="store_true")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(threadName)s %(name)s: %(message)s",
    )

    settings = Settings()
    if args.output:
        settings.output_dir = args.output
    if args.storage:
        settings.storage = args.storage
    if args.workers:
        settings.workers = args.workers
    if args.delay is not None:
        settings.min_interval = args.delay
    settings.save_raw = settings.save_raw or args.save_raw
    settings.__post_init__()
    resume = not args.no_resume

    with TikiCrawler(settings) as crawler:
        if args.cmd == "categories":
            crawler.crawl_categories(args.root, max_depth=args.depth)

        elif args.cmd == "category":
            for cid in args.category_id:
                it = crawler.iter_category(cid, args.pages, sort=args.sort, resume=resume)
                if args.details:
                    crawler.crawl_details(it, with_reviews=args.reviews, skip_done=resume)
                else:
                    for _ in it:
                        pass

        elif args.cmd == "search":
            it = crawler.iter_search(args.keyword, args.pages, resume=resume)
            if args.details:
                crawler.crawl_details(it, with_reviews=args.reviews, skip_done=resume)
            else:
                for _ in it:
                    pass

        elif args.cmd == "product":
            for pid in args.product_id:
                crawler.fetch_product(pid, with_reviews=args.reviews)
    return 0


if __name__ == "__main__":
    sys.exit(main())

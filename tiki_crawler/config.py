"""Cấu hình chung cho crawler. Có thể override bằng biến môi trường hoặc tham số CLI."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

BASE_URL = "https://tiki.vn"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) "
    "Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
]


def _env(name: str, default):
    value = os.getenv(f"TIKI_{name}")
    if value is None:
        return default
    return type(default)(value)


@dataclass
class Settings:
    # HTTP
    timeout: float = _env("TIMEOUT", 15.0)
    max_retries: int = _env("MAX_RETRIES", 5)
    backoff_factor: float = _env("BACKOFF", 1.5)        # chờ = backoff * 2^attempt
    min_interval: float = _env("MIN_INTERVAL", 0.5)     # giây tối thiểu giữa 2 request (toàn cục)
    proxies: list[str] = field(default_factory=lambda: [
        p for p in os.getenv("TIKI_PROXIES", "").split(",") if p
    ])

    # Crawl
    workers: int = _env("WORKERS", 4)                   # số thread lấy chi tiết sản phẩm
    page_size: int = _env("PAGE_SIZE", 40)              # Tiki cho tối đa 40 sp / trang
    max_pages: int = _env("MAX_PAGES", 50)
    review_page_size: int = _env("REVIEW_PAGE_SIZE", 20)
    max_review_pages: int = _env("MAX_REVIEW_PAGES", 5)

    # Output
    output_dir: Path = Path(os.getenv("TIKI_OUTPUT_DIR", "data"))
    storage: str = os.getenv("TIKI_STORAGE", "jsonl")   # jsonl | csv | sqlite
    save_raw: bool = os.getenv("TIKI_SAVE_RAW", "0") == "1"

    def __post_init__(self):
        self.output_dir = Path(self.output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

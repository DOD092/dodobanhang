"""HTTP client: session tái sử dụng, giới hạn tốc độ, retry + backoff, xoay User-Agent/proxy."""
from __future__ import annotations

import itertools
import logging
import random
import threading
import time
from typing import Any

import requests

from .config import BASE_URL, USER_AGENTS, Settings

log = logging.getLogger(__name__)

RETRY_STATUS = {429, 500, 502, 503, 504}


class RateLimiter:
    """Đảm bảo khoảng cách tối thiểu giữa các request, an toàn khi chạy đa luồng."""

    def __init__(self, min_interval: float):
        self.min_interval = min_interval
        self._lock = threading.Lock()
        self._next_time = 0.0

    def wait(self) -> None:
        with self._lock:
            now = time.monotonic()
            sleep_for = self._next_time - now
            self._next_time = max(now, self._next_time) + self.min_interval
        if sleep_for > 0:
            time.sleep(sleep_for)


class TikiHTTPError(Exception):
    def __init__(self, status: int, url: str, body: str = ""):
        super().__init__(f"HTTP {status} for {url}: {body[:200]}")
        self.status = status
        self.url = url


class TikiClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.rate_limiter = RateLimiter(settings.min_interval)
        self._local = threading.local()  # mỗi thread 1 Session (requests.Session không thread-safe hoàn toàn)
        self._proxy_cycle = itertools.cycle(settings.proxies) if settings.proxies else None
        self._proxy_lock = threading.Lock()

    # ---------- internals ----------
    @property
    def session(self) -> requests.Session:
        s = getattr(self._local, "session", None)
        if s is None:
            s = requests.Session()
            s.headers.update({
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
                "Referer": BASE_URL + "/",
                "Origin": BASE_URL,
            })
            self._local.session = s
        return s

    def _next_proxy(self) -> dict[str, str] | None:
        if not self._proxy_cycle:
            return None
        with self._proxy_lock:
            p = next(self._proxy_cycle)
        return {"http": p, "https": p}

    # ---------- public ----------
    def get_json(self, url: str, params: dict[str, Any] | None = None) -> Any:
        if url.startswith("/"):
            url = BASE_URL + url

        last_exc: Exception | None = None
        for attempt in range(self.settings.max_retries + 1):
            self.rate_limiter.wait()
            headers = {"User-Agent": random.choice(USER_AGENTS)}
            try:
                resp = self.session.get(
                    url, params=params, headers=headers,
                    timeout=self.settings.timeout, proxies=self._next_proxy(),
                )
                if resp.status_code == 200:
                    return resp.json()
                if resp.status_code == 404:
                    raise TikiHTTPError(404, resp.url, resp.text)
                if resp.status_code not in RETRY_STATUS:
                    raise TikiHTTPError(resp.status_code, resp.url, resp.text)
                last_exc = TikiHTTPError(resp.status_code, resp.url, resp.text)
                retry_after = resp.headers.get("Retry-After")
                delay = float(retry_after) if retry_after and retry_after.isdigit() else None
            except (requests.ConnectionError, requests.Timeout, ValueError) as exc:
                last_exc = exc
                delay = None

            if attempt < self.settings.max_retries:
                delay = delay or self.settings.backoff_factor * (2 ** attempt) + random.uniform(0, 1)
                log.warning("Retry %d/%d sau %.1fs: %s", attempt + 1, self.settings.max_retries, delay, last_exc)
                time.sleep(delay)

        raise last_exc  # type: ignore[misc]

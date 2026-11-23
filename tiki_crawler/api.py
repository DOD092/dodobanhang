"""Lớp bọc các endpoint JSON của Tiki. Chỉ trả về dict thô — việc parse nằm ở models.py.

Nếu Tiki đổi API, chỉ cần sửa file này.
"""
from __future__ import annotations

from typing import Any

from .client import TikiClient


class TikiAPI:
    LISTING = "/api/personalish/v1/blocks/listings"
    SEARCH = "/api/v2/products"  # listing bắt buộc có category, nên search dùng endpoint này
    CATEGORIES = "/api/v2/categories"
    PRODUCT = "/api/v2/products/{product_id}"
    REVIEWS = "/api/v2/reviews"

    def __init__(self, client: TikiClient):
        self.client = client

    def categories(self, parent_id: int | None = None) -> dict[str, Any]:
        params = {"include": "children"}
        if parent_id is not None:
            params["parent_id"] = parent_id
        return self.client.get_json(self.CATEGORIES, params)

    def listing(self, category_id: int, page: int = 1, limit: int = 40,
                url_key: str | None = None, sort: str | None = None) -> dict[str, Any]:
        params: dict[str, Any] = {
            "limit": limit,
            "include": "advertisement",
            "aggregations": 2,
            "category": category_id,
            "page": page,
        }
        if url_key:
            params["urlKey"] = url_key
        if sort:  # vd: top_seller, newest, price,asc, price,desc
            params["sort"] = sort
        return self.client.get_json(self.LISTING, params)

    def search(self, keyword: str, page: int = 1, limit: int = 40) -> dict[str, Any]:
        params = {"limit": limit, "include": "advertisement", "aggregations": 2,
                  "q": keyword, "page": page}
        return self.client.get_json(self.SEARCH, params)

    def product(self, product_id: int, spid: int | None = None) -> dict[str, Any]:
        params: dict[str, Any] = {"platform": "web", "version": 3}
        if spid:
            params["spid"] = spid
        return self.client.get_json(self.PRODUCT.format(product_id=product_id), params)

    def reviews(self, product_id: int, page: int = 1, limit: int = 20,
                spid: int | None = None, seller_id: int | None = None) -> dict[str, Any]:
        params: dict[str, Any] = {
            "limit": limit,
            "include": "comments,contribute_info,attribute_vote_summary",
            "sort": "score|desc,id|desc,stars|all",
            "page": page,
            "product_id": product_id,
        }
        if spid:
            params["spid"] = spid
        if seller_id:
            params["seller_id"] = seller_id
        return self.client.get_json(self.REVIEWS, params)

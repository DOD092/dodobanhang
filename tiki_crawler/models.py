"""Data model + hàm parse từ JSON thô của Tiki. Parse 'phòng thủ' — thiếu field thì để None."""
from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any

_TAG_RE = re.compile(r"<[^>]+>")


def _strip_html(html: str | None) -> str | None:
    if not html:
        return None
    return re.sub(r"\s+", " ", _TAG_RE.sub(" ", html)).strip()


def _sold(d: dict) -> int | None:
    qs = d.get("quantity_sold")
    if isinstance(qs, dict):
        return qs.get("value")
    return qs if isinstance(qs, int) else None


def _ts(value: Any) -> str | None:
    if isinstance(value, (int, float)) and value > 0:
        return datetime.fromtimestamp(value, tz=timezone.utc).isoformat()
    return value if isinstance(value, str) else None


class Record:
    TABLE: str = ""
    KEY: str = "id"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    def to_flat(self) -> dict[str, Any]:
        """Dùng cho CSV/SQLite: list/dict -> chuỗi JSON."""
        return {k: (json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v)
                for k, v in self.to_dict().items()}


@dataclass
class Category(Record):
    TABLE = "categories"
    id: int
    name: str
    url_key: str | None = None
    parent_id: int | None = None
    level: int | None = None
    is_leaf: bool | None = None
    product_count: int | None = None

    @classmethod
    def from_api(cls, d: dict) -> "Category":
        return cls(
            id=d["id"], name=d.get("name", ""), url_key=d.get("url_key"),
            parent_id=d.get("parent_id"), level=d.get("level"),
            is_leaf=d.get("is_leaf"), product_count=d.get("product_count"),
        )


@dataclass
class ProductSummary(Record):
    """Bản ghi từ trang listing — đủ để lấy chi tiết sau."""
    TABLE = "product_summaries"
    id: int
    name: str
    spid: int | None = None
    seller_id: int | None = None
    price: int | None = None
    original_price: int | None = None
    discount_rate: int | None = None
    rating_average: float | None = None
    review_count: int | None = None
    quantity_sold: int | None = None
    brand_name: str | None = None
    thumbnail_url: str | None = None
    url_path: str | None = None
    category_id: int | None = None

    @classmethod
    def from_api(cls, d: dict, category_id: int | None = None) -> "ProductSummary":
        return cls(
            id=d["id"], name=d.get("name", ""),
            spid=d.get("seller_product_id"), seller_id=d.get("seller_id"),
            price=d.get("price"), original_price=d.get("original_price"),
            discount_rate=d.get("discount_rate"), rating_average=d.get("rating_average"),
            review_count=d.get("review_count"), quantity_sold=_sold(d),
            brand_name=d.get("brand_name"), thumbnail_url=d.get("thumbnail_url"),
            url_path=d.get("url_path"), category_id=category_id,
        )


@dataclass
class Product(Record):
    TABLE = "products"
    id: int
    name: str
    sku: str | None = None
    url: str | None = None
    price: int | None = None
    list_price: int | None = None
    original_price: int | None = None
    discount_rate: int | None = None
    rating_average: float | None = None
    review_count: int | None = None
    quantity_sold: int | None = None
    inventory_status: str | None = None
    brand_id: int | None = None
    brand_name: str | None = None
    seller_id: int | None = None
    seller_name: str | None = None
    spid: int | None = None
    category_id: int | None = None
    category_name: str | None = None
    breadcrumbs: list[str] = field(default_factory=list)
    short_description: str | None = None
    description: str | None = None
    specifications: dict[str, str] = field(default_factory=dict)
    images: list[str] = field(default_factory=list)
    crawled_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def from_api(cls, d: dict) -> "Product":
        brand = d.get("brand") or {}
        seller = d.get("current_seller") or {}
        cat = d.get("categories") or {}
        specs: dict[str, str] = {}
        for group in d.get("specifications") or []:
            for attr in group.get("attributes") or []:
                if attr.get("name"):
                    specs[attr["name"]] = _strip_html(str(attr.get("value", ""))) or ""
        return cls(
            id=d["id"], name=d.get("name", ""), sku=d.get("sku"),
            url=d.get("short_url") or (f"https://tiki.vn/{d['url_path']}" if d.get("url_path") else None),
            price=d.get("price"), list_price=d.get("list_price"),
            original_price=d.get("original_price"), discount_rate=d.get("discount_rate"),
            rating_average=d.get("rating_average"), review_count=d.get("review_count"),
            quantity_sold=_sold(d), inventory_status=d.get("inventory_status"),
            brand_id=brand.get("id"), brand_name=brand.get("name"),
            seller_id=seller.get("id"), seller_name=seller.get("name"),
            spid=seller.get("product_id"),
            category_id=cat.get("id"), category_name=cat.get("name"),
            breadcrumbs=[b.get("name") for b in d.get("breadcrumbs") or [] if b.get("name")],
            short_description=d.get("short_description"),
            description=_strip_html(d.get("description")),
            specifications=specs,
            images=[i.get("base_url") for i in d.get("images") or [] if i.get("base_url")],
        )


@dataclass
class Review(Record):
    TABLE = "reviews"
    id: int
    product_id: int
    rating: int | None = None
    title: str | None = None
    content: str | None = None
    thank_count: int | None = None
    customer_id: int | None = None
    customer_name: str | None = None
    created_at: str | None = None
    images: list[str] = field(default_factory=list)

    @classmethod
    def from_api(cls, d: dict, product_id: int) -> "Review":
        author = d.get("created_by") or {}
        return cls(
            id=d["id"], product_id=d.get("product_id") or product_id,
            rating=d.get("rating"), title=d.get("title"), content=d.get("content"),
            thank_count=d.get("thank_count"),
            customer_id=author.get("id") or d.get("customer_id"),
            customer_name=author.get("full_name") or author.get("name"),
            created_at=_ts(d.get("created_at")),
            images=[i.get("full_path") for i in d.get("images") or [] if i.get("full_path")],
        )

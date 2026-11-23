"""Data model + hàm parse từ JSON thô của Tiki. Parse 'phòng thủ' — thiếu field thì để None."""
from __future__ import annotations

import html as html_lib
import json
import re
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any

_TAG_RE = re.compile(r"<[^>]+>")
# Thẻ kết thúc 1 khối -> xuống dòng (giữ đoạn văn / gạch đầu dòng khi bỏ HTML)
_BLOCK_END_RE = re.compile(r"<\s*(br\s*/?|/p|/div|/li|/h[1-6]|/tr)\s*>", re.IGNORECASE)
_LI_START_RE = re.compile(r"<\s*li[^>]*>", re.IGNORECASE)


def _strip_html(html: str | None) -> str | None:
    """HTML -> 1 dòng (dùng cho giá trị ngắn như thông số kỹ thuật)."""
    if not html:
        return None
    return re.sub(r"\s+", " ", html_lib.unescape(_TAG_RE.sub(" ", html))).strip()


def _html_to_text(html: str | None) -> str | None:
    """HTML -> text nhiều dòng: giữ xuống dòng giữa các đoạn, <li> thành '- ', bỏ dòng trống thừa."""
    if not html:
        return None
    text = _LI_START_RE.sub("- ", _BLOCK_END_RE.sub("\n", html))
    text = html_lib.unescape(_TAG_RE.sub(" ", text))
    lines = [re.sub(r"[ \t\xa0]+", " ", line).strip() for line in text.splitlines()]
    text = re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()
    return text or None


def _leaf_category(d: dict) -> tuple[int | None, str | None, list[dict]]:
    """Danh mục lá + đường dẫn danh mục. `categories` của API chi tiết chỉ là danh mục GỐC
    (vd 'Nhà Cửa - Đời Sống'); danh mục lá nằm cuối `breadcrumbs` (phần tử cuối là chính sản
    phẩm, category_id = 0 -> bỏ)."""
    path = [
        {"id": b["category_id"], "name": b.get("name")}
        for b in d.get("breadcrumbs") or []
        if isinstance(b.get("category_id"), int) and b["category_id"] > 0
    ]
    if path:
        return path[-1]["id"], path[-1]["name"], path
    cat = d.get("categories") or {}
    return cat.get("id"), cat.get("name"), ([{"id": cat["id"], "name": cat.get("name")}] if cat.get("id") else [])


def _variants(d: dict) -> list[dict]:
    """Biến thể (configurable_products): sku, nhãn lựa chọn ('Kích cỡ: Combo 5 đèn'), giá, ảnh.
    Sản phẩm không có biến thể -> [] (bên import tự tạo 1 biến thể từ sku/giá của sản phẩm)."""
    option_names = [o.get("name") for o in d.get("configurable_options") or []]
    out = []
    for c in d.get("configurable_products") or []:
        labels = []
        for i, name in enumerate(option_names, start=1):
            value = (c.get(f"option{i}") or "").strip()
            if value:
                labels.append(f"{name}: {value}" if name else value)
        out.append({
            "sku": c.get("sku"),
            "option": ", ".join(labels) or None,
            "price": c.get("price"),
            "original_price": c.get("original_price"),
            "inventory_status": c.get("inventory_status"),
            "image": next((i.get("large_url") for i in c.get("images") or [] if i.get("large_url")), None),
        })
    return out


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
    category_name: str | None = None          # danh mục LÁ (từ breadcrumbs), không phải danh mục gốc
    category_path: list[dict] = field(default_factory=list)  # [{id, name}] từ gốc tới lá
    breadcrumbs: list[str] = field(default_factory=list)
    short_description: str | None = None
    description: str | None = None
    specifications: dict[str, str] = field(default_factory=dict)
    images: list[str] = field(default_factory=list)
    variants: list[dict] = field(default_factory=list)  # xem _variants(); [] = sản phẩm 1 biến thể
    crawled_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def from_api(cls, d: dict) -> "Product":
        brand = d.get("brand") or {}
        seller = d.get("current_seller") or {}
        category_id, category_name, category_path = _leaf_category(d)
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
            category_id=category_id, category_name=category_name, category_path=category_path,
            breadcrumbs=[b.get("name") for b in d.get("breadcrumbs") or [] if b.get("name")],
            short_description=_strip_html(d.get("short_description")),
            description=_html_to_text(d.get("description")),
            specifications=specs,
            images=[i.get("base_url") for i in d.get("images") or [] if i.get("base_url")],
            variants=_variants(d),
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

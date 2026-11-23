# Tiki Crawler

Khung crawl dữ liệu Tiki.vn qua các API JSON công khai (không parse HTML).

## Kiến trúc

```
tiki_crawler/
├── config.py      # Settings: timeout, retry, delay, số luồng, output (override bằng env TIKI_*)
├── client.py      # HTTP: Session/thread, RateLimiter toàn cục, retry + exponential backoff, xoay UA/proxy
├── api.py         # Định nghĩa endpoint Tiki (chỉ sửa file này khi Tiki đổi API)
├── models.py      # Dataclass Category / ProductSummary / Product / Review + parse JSON
├── storage.py     # Backend lưu: jsonl | csv | sqlite (upsert theo id)
├── checkpoint.py  # Resume: nhớ trang listing & sản phẩm đã crawl
├── crawler.py     # Điều phối: listing → chi tiết (ThreadPool) → review
└── cli.py         # Dòng lệnh
```

Luồng dữ liệu:

```
categories ─┐
            ├─► listing / search (phân trang) ─► ProductSummary ─► [ThreadPool] product detail ─► Product
keyword ────┘                                                                    └─► reviews ─► Review
                                         mọi bản ghi ─► Storage  |  tiến độ ─► checkpoint.json
```

| Endpoint | Dùng cho |
|---|---|
| `GET /api/v2/categories?parent_id=` | Cây danh mục |
| `GET /api/personalish/v1/blocks/listings?category=&page=` | Sản phẩm theo danh mục |
| `GET /api/v2/products?q=&page=` | Tìm kiếm theo từ khoá |
| `GET /api/v2/products/{id}?spid=` | Chi tiết sản phẩm |
| `GET /api/v2/reviews?product_id=&page=` | Đánh giá |

## Cài đặt

```bash
pip install -r requirements.txt
```

## Sử dụng

```bash
# Cây danh mục con của "Điện Thoại - Máy Tính Bảng" (1789)
python -m tiki_crawler categories --root 1789 --depth 2

# Sản phẩm danh mục Smartphone (1795): 5 trang, kèm chi tiết + review, lưu SQLite
python -m tiki_crawler --storage sqlite category 1795 --pages 5 --details --reviews

# Tìm kiếm
python -m tiki_crawler search "tai nghe bluetooth" --pages 3 --details

# Sản phẩm cụ thể
python -m tiki_crawler product 278628866 --reviews

# Tuỳ chọn chung (đặt TRƯỚC sub-command)
#   --output DIR  --storage jsonl|csv|sqlite  --workers N  --delay SEC  --save-raw  --no-resume  -v
```

Dùng như thư viện:

```python
from tiki_crawler import Settings, TikiCrawler

with TikiCrawler(Settings(storage="sqlite", workers=4)) as c:
    c.crawl_details(c.iter_category(1795, max_pages=2), with_reviews=True)
```

Biến môi trường: `TIKI_TIMEOUT`, `TIKI_MAX_RETRIES`, `TIKI_MIN_INTERVAL`, `TIKI_WORKERS`,
`TIKI_MAX_PAGES`, `TIKI_STORAGE`, `TIKI_OUTPUT_DIR`, `TIKI_PROXIES` (phân tách bằng dấu phẩy).

## Mở rộng

- **Thêm trường dữ liệu**: thêm field vào dataclass trong `models.py` và map trong `from_api`.
  Bật `--save-raw` để xem JSON gốc.
- **Thêm backend** (Postgres, MongoDB, Kafka…): kế thừa `Storage`, cài đặt `save()`, đăng ký trong `make_storage`.
- **Thêm loại dữ liệu** (seller, coupon…): thêm method trong `api.py` + model mới + method trong `crawler.py`.

## Lưu ý

- Giữ `--delay` ≥ 0.3s và số luồng vừa phải để tránh bị chặn (HTTP 429). Client đã tự backoff khi gặp 429/5xx.
- Listing của Tiki giới hạn khoảng 50 trang (2000 sp) mỗi truy vấn. Để lấy nhiều hơn, chia theo danh mục lá
  hoặc dùng `--sort` khác nhau (`top_seller`, `newest`, `price,asc`, `price,desc`).
- Tôn trọng điều khoản sử dụng của Tiki; chỉ dùng dữ liệu cho mục đích hợp pháp.

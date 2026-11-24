---
name: db-safety
description: An toàn schema DB dùng chung (Aiven, TypeORM synchronize). Dùng TRƯỚC khi thêm/sửa/xoá cột hoặc bảng, đổi kiểu, nullable/NOT NULL, bật SEED_CATALOG / SEED_TIKI, chạy seed, migration, hoặc khi gặp lỗi "Unable to connect to the database" lúc boot backend.
---

# DB safety — một DB Aiven cho cả nhóm, `synchronize: true`

`synchronize` **thêm cột có trong entity và XOÁ cột không có**. Mỗi nhánh boot vào Aiven là sửa schema của cả nhóm.
Chi tiết sự cố gốc: `backend/backend.md` mục 5.1 (Grep `## 5.1`).

## Trước khi đổi entity

1. Thêm bảng / cột nullable / cột có `default` → synchronize tự làm, an toàn.
2. Thêm cột **NOT NULL vào bảng có dữ liệu** → không để synchronize làm; làm tay:
   ```sql
   ALTER TABLE t ADD COLUMN c <type>;     -- nullable trước
   UPDATE t SET c = <default>;            -- backfill
   ALTER TABLE t ALTER COLUMN c SET NOT NULL;
   ```
   Hoặc cho nullable / có default.
3. Đổi kiểu cột = TypeORM drop + add → mất dữ liệu.
4. Sửa/xoá cột: **nhắc người dùng báo cả nhóm** và merge sớm lên `dev` để không có 2 phiên bản entity cùng chạy.
5. Ghi thay đổi lệch ERD vào backend.md mục 4.

## Thay đổi đang treo (phải nhắc khi liên quan)

- `product_variants.price` nullable (`null` = "Liên hệ"): merge lên `dev` **trước** khi bật `SEED_CATALOG=true` trên Aiven (mục 7.4).
- `products` thêm `author, rating_average, review_count, sold_count, specifications` (mục 7.8): nhánh thiếu 5 cột này boot sẽ DROP chúng.

## Seed

| Cờ `backend/.env` | Nạp | Lưu ý |
| --- | --- | --- |
| `SEED_CATALOG=true` | 5 nhóm + 13 sản phẩm thật (`src/database/catalog-seed/`) | Idempotent; bật 1 lần rồi tắt |
| `SEED_TIKI=true` | sản phẩm crawl từ `data/products.jsonl` (`src/database/tiki-seed/`) | **Chỉ DB test/local, không bật trên Aiven** (bản quyền). Xoá: `DELETE FROM products WHERE slug LIKE '%-tiki-%'` |

Chi tiết Tiki: backend.md mục 7.7–7.8.

## Không bao giờ tự làm

- Không chạy SQL ghi/xoá, không bật seed trên Aiven, không đổi `.env` khi chưa được người dùng xác nhận rõ.
- Không commit `.env`. Test thay đổi schema trên Postgres tạm (Docker) thay vì Aiven.

## Debug boot

"Unable to connect to the database. Retrying..." thường là **lỗi query**, không phải mạng: tìm dòng `query failed:` ngay phía trên trong log.

# CLAUDE.md — dodobanhang backend

Tài liệu thống nhất giữa Dat và Claude về cấu trúc database & code convention của backend.
Đọc file này trước khi thêm bảng / module mới.

Stack: **NestJS 10 + TypeORM 0.3 + PostgreSQL 16 (Docker)**.
Nguồn schema: ERD `../db_ecommerce.png` (20 bảng) + bảng `admins` do Dat tự thêm.

---

## 1. Quy ước đã thống nhất

| Chủ đề | Quyết định | Lý do |
| --- | --- | --- |
| Khoá chính | **UUID** cho tất cả các bảng: `@PrimaryGeneratedColumn('uuid') id: string` | Dat yêu cầu thay toàn bộ `bigserial` trong ERD bằng uuid |
| Tên cột DB | **snake_case tường minh**: `@Column({ type, length, name: 'user_id' })` | Property TS vẫn camelCase; khai báo `name` để cột trong Postgres không phải quote |
| Kiểu cột | Khai báo **type + length/precision đúng ERD** (`varchar(150)`, `numeric(18,2)`, `text`…) | Giữ đúng ràng buộc thiết kế, không để TypeORM tự đoán |
| Quan hệ | **Cột uuid + `@ManyToOne` / `@JoinColumn`** → Postgres sinh FOREIGN KEY thật | Xem mục 3.1. Giữ cả cột uuid thô (`userId`) lẫn property quan hệ (`user`) để DTO không phải đổi |
| Phạm vi mỗi bảng | **Full CRUD**: entity + create/update DTO + service + controller + module | Giống hệt khuôn mẫu `src/module/address` |
| Thời gian | `@CreateDateColumn` / `@UpdateDateColumn` kiểu `timestamptz`, cột `created_at` / `updated_at` | Timezone-aware; ERD chỉ ghi `timestamp` |
| Tên bảng | Số nhiều: `users`, `products`, `addresses`… | ERD ghi bảng là `address`, ta dùng `addresses` cho nhất quán. Ngoại lệ: `order_status_history` giữ nguyên như ERD |
| Tên thư mục module | Số ít, kebab-case: `product-variant/` | Theo mẫu `address/` |
| Route API | Số nhiều, kebab-case: `/api/product-variants` | |

### Khuôn mẫu một module (bắt buộc giống nhau)

```
src/module/<ten-module>/
  <ten-module>.module.ts        # TypeOrmModule.forFeature([Entity]) -> dòng này sinh bảng
  <ten-module>.controller.ts    # POST / GET (paginated) / GET :id / PATCH :id / DELETE :id
  <ten-module>.service.ts       # create / findAll / findOne / update / remove
  dto/create-<ten-module>.dto.ts
  dto/update-<ten-module>.dto.ts # extends PartialType(Create...Dto)
  entities/<ten-module>.entity.ts
```

Sau khi tạo module mới **phải** thêm nó vào mảng `imports` của `src/app.module.ts`,
nếu không TypeORM sẽ không sinh bảng.

---

## 2. Hạ tầng dùng chung

| File | Công dụng |
| --- | --- |
| `src/common/transformers/numeric.transformer.ts` | Postgres `numeric` bị driver `pg` trả về **string**. Mọi cột tiền/khối lượng đều gắn `transformer: numericTransformer` để trả về `number` |
| `src/common/dto/pagination-query.dto.ts` | `?page=&limit=` cho mọi endpoint `findAll` |
| `src/common/enum/*.enum.ts` | Các enum lấy từ note trong ERD (xem bảng dưới) |
| `src/common/filters/http-exception.filter.ts` | Chuẩn hoá lỗi (catch-all) |
| `src/common/filters/database-error.mapper.ts` | Dịch mã lỗi ràng buộc Postgres → HTTP 4xx. **Không** tách thành filter riêng vì filter catch-all `@Catch()` luôn bắt trước, nên phải gọi mapper từ trong nó |
| `src/common/interceptors/transform-response.interceptor.ts` | Bọc response `{ data, statusCode, timestamp }` |

### Enum (chỉ tạo enum ở nơi ERD ghi rõ giá trị)

| Enum | Giá trị | Dùng ở |
| --- | --- | --- |
| `UserStatus` | ACTIVE, INACTIVE, BLOCKED | `users.status` |
| `CartStatus` | ACTIVE, CHECKED_OUT, ABANDONED | `carts.status` |
| `OrderStatus` | PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPING, DELIVERED, CANCELLED, RETURNED | `orders.status`, `order_status_history.from_status/to_status` |
| `ShipmentCarrier` | GHN, GHTK, VIETTEL_POST, JT | `shipments.carrier` |
| `ShipmentStatus` | CREATED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, RETURNED | `shipments.status` |
| `PaymentMethod` | COD, BANK_TRANSFER, MOMO, VNPAY, CREDIT_CARD | `payments.payment_method` |
| `PaymentStatus` | PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED | `payments.status`, `orders.payment_status`, `payment_transactions.status` |
| `TransactionType` | PAYMENT, REFUND, PARTIAL_REFUND, REVERSAL | `payment_transactions.transaction_type` |
| `DiscountType` | PERCENT, FIXED_AMOUNT | `vouchers.discount_type` |

Các cột `status` mà ERD **không** ghi giá trị (brands, categories, products, product_variants,
warehouses, vouchers, reviews) tạm để `varchar(20)` + `@IsString()` — chưa tự đặt ra giá trị.

---

## 3. 21 bảng đã tạo

| # | Bảng | Module | Route |
| --- | --- | --- | --- |
| 1 | `users` | `user` | `/api/users` |
| 2 | `admins` | `admin` | `/api/admins` |
| 3 | `addresses` | `address` | `/api/addresses` |
| 4 | `categories` | `category` | `/api/categories` |
| 5 | `brands` | `brand` | `/api/brands` |
| 6 | `products` | `product` | `/api/products` |
| 7 | `product_variants` | `product-variant` | `/api/product-variants` |
| 8 | `product_images` | `product-image` | `/api/product-images` |
| 9 | `warehouses` | `warehouse` | `/api/warehouses` |
| 10 | `inventories` | `inventory` | `/api/inventories` |
| 11 | `carts` | `cart` | `/api/carts` |
| 12 | `cart_items` | `cart-item` | `/api/cart-items` |
| 13 | `orders` | `order` | `/api/orders` |
| 14 | `order_items` | `order-item` | `/api/order-items` |
| 15 | `order_status_history` | `order-status-history` | `/api/order-status-history` |
| 16 | `shipments` | `shipment` | `/api/shipments` |
| 17 | `payments` | `payment` | `/api/payments` |
| 18 | `payment_transactions` | `payment-transaction` | `/api/payment-transactions` |
| 19 | `vouchers` | `voucher` | `/api/vouchers` |
| 20 | `order_vouchers` | `order-voucher` | `/api/order-vouchers` |
| 21 | `reviews` | `review` | `/api/reviews` |

### 3.1. Khoá ngoại — 27 FK theo ERD

Mỗi FK khai báo trong entity theo mẫu (giữ **cả hai**: cột uuid thô để DTO/service dùng,
và property quan hệ để join khi cần):

```ts
@Column({ type: 'uuid', name: 'user_id' })
userId: string;

@ManyToOne(() => User, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'user_id' })
user: User;
```

| Bảng con | Cột | → Bảng cha | ON DELETE |
| --- | --- | --- | --- |
| `addresses` | `user_id` | `users` | CASCADE |
| `admins` | `user_id` (PK, `@OneToOne`) | `users` | CASCADE |
| `categories` | `parent_id` | `categories` (tự tham chiếu) | SET NULL |
| `products` | `category_id` | `categories` | RESTRICT |
| `products` | `brand_id` | `brands` | RESTRICT |
| `product_variants` | `product_id` | `products` | CASCADE |
| `product_images` | `product_id` | `products` | CASCADE |
| `product_images` | `variant_id` | `product_variants` | SET NULL |
| `inventories` | `warehouse_id` | `warehouses` | CASCADE |
| `inventories` | `variant_id` | `product_variants` | CASCADE |
| `carts` | `user_id` | `users` | CASCADE |
| `cart_items` | `cart_id` | `carts` | CASCADE |
| `cart_items` | `variant_id` | `product_variants` | CASCADE |
| `orders` | `user_id` | `users` | RESTRICT |
| `orders` | `shipping_address_id` | `addresses` | RESTRICT |
| `order_items` | `order_id` | `orders` | CASCADE |
| `order_items` | `variant_id` | `product_variants` | RESTRICT |
| `order_status_history` | `order_id` | `orders` | CASCADE |
| `order_status_history` | `changed_by` | `users` | SET NULL |
| `shipments` | `order_id` | `orders` | CASCADE |
| `payments` | `order_id` | `orders` | CASCADE |
| `payment_transactions` | `payment_id` | `payments` | CASCADE |
| `order_vouchers` | `order_id` | `orders` | CASCADE |
| `order_vouchers` | `voucher_id` | `vouchers` | RESTRICT |
| `reviews` | `user_id` | `users` | CASCADE |
| `reviews` | `product_id` | `products` | CASCADE |
| `reviews` | `order_item_id` | `order_items` | CASCADE |

**Quy tắc chọn ON DELETE** (ERD không quy định, đây là quyết định của chúng ta):

- **CASCADE** — bản ghi con vô nghĩa nếu thiếu cha (biến thể của sản phẩm, item của giỏ,
  item/lịch sử/vận đơn/thanh toán của đơn, tồn kho của kho).
- **RESTRICT** — chặn xoá dữ liệu đang được tham chiếu bởi chứng từ cần lưu vết:
  không cho xoá category/brand còn sản phẩm, không cho xoá user/địa chỉ đã có đơn,
  không cho xoá biến thể đã từng được bán (`order_items`), không cho xoá voucher đã áp dụng.
- **SET NULL** — chỉ dùng cho cột nullable: `categories.parent_id` (bỏ cấp cha thì thành
  danh mục gốc), `product_images.variant_id` (ảnh vẫn thuộc sản phẩm),
  `order_status_history.changed_by` (giữ lịch sử dù nhân sự bị xoá).

Chưa khai báo chiều ngược `@OneToMany` (`product.variants`, `order.items`…) — thêm sau
nếu cần navigate 2 chiều; FK dưới DB không phụ thuộc vào việc đó.

### Bảng thiếu timestamp (theo đúng ERD)

- `product_images`, `order_status_history`, `order_vouchers`: chỉ có `created_at`.
- `inventories`: chỉ có `updated_at`.
- `order_items`: **không có** cột thời gian nào.

### `admins` — trường hợp đặc biệt

Bảng này **không có trong ERD**, do Dat tự thêm. Giữ nguyên thiết kế của Dat:
khoá chính là `user_id` (lấy từ `users`, quan hệ 1-1), không tự sinh — chỉ đổi
`bigint` → `uuid` theo quy ước chung. Route dùng `:userId` thay vì `:id`,
và `UpdateAdminDto` loại bỏ `userId` (không cho sửa khoá chính).

---

## 4. Chỗ cố tình khác ERD (cần Dat xác nhận)

| Vị trí | ERD | Đã làm | Lý do |
| --- | --- | --- | --- |
| `shipments.shipped_at`, `shipments.delivered_at` | không đánh dấu `N` | **nullable** | Lúc tạo shipment chưa thể có ngày giao — ERD nhiều chỗ khác có đánh `N` nên đây gần như chắc chắn là sót |
| `product_images.variant_id` | không đánh dấu `N` | **nullable** | Ảnh có thể thuộc về sản phẩm chung, chưa gắn biến thể |
| `product_images.sort_order`, `is_primary` | không có DEFAULT | `default 0` / `default false` | Tránh phải truyền tay mỗi lần tạo |
| `inventories.quantity_available` | không có DEFAULT | `default 0` | Đồng bộ với 2 cột quantity còn lại |
| `admins.position` | ERD nháp ghi `postition` | `position` | Sửa lỗi chính tả (comment đã ghi trong entity) |
| `shipments.carrier` giá trị `J&T` | `J&T` | `JT` | Ký tự `&` không hợp lệ cho tên thành viên enum trong TS |
| `inventories` PK | `invetory_id` | `id` | Sửa lỗi chính tả + dùng `id` thống nhất |

Ràng buộc `CHECK` trong ERD (`quantity > 0`, `rating 1-5`) hiện **chỉ validate ở tầng DTO**
(`@Min` / `@Max`), chưa tạo CHECK constraint dưới DB. Nếu muốn ép ở DB thì thêm `@Check()`.

---

## 5. Chạy & kiểm thử

```bash
docker compose up -d          # Postgres 16 tại localhost:5432 (postgres/postgres/dodobanhang)
npm install
npm run start:dev             # synchronize: true -> tự sinh/cập nhật bảng
# Swagger: http://localhost:3000/docs
# API:     http://localhost:3000/api/<route>
```

**Đã verify (04/09/2026):** `npm run build` sạch, app boot không lỗi, Postgres sinh đủ
**21 bảng + 27 FOREIGN KEY**. Smoke test đã chạy:

| Kịch bản | Kết quả |
| --- | --- |
| `POST/GET /api/brands`, `POST /api/product-variants` | 201/200, `price` trả về `number` chứ không phải string |
| Enum sai (`status: "WRONG"`) | 400 kèm danh sách giá trị hợp lệ |
| `POST /api/carts` với `userId` không tồn tại | **409 ForeignKeyViolation** — `Key (user_id)=(...) is not present in table "users"` |
| `DELETE /api/brands/:id` khi brand còn product (RESTRICT) | **409 ForeignKeyViolation** — `still referenced from table "products"` |
| `slug` trùng | **409 UniqueViolation** |
| `DELETE /api/carts/:id` (CASCADE) | cart_items liên quan tự bị xoá theo |
| `GET /api/brands/:id` không tồn tại | 404 |

### Lưu ý về `synchronize: true`

`src/app.module.ts` đang hardcode connection và bật `synchronize: true` (code-first).
Tiện cho dev nhưng **TypeORM sẽ drop/add cột khi đổi kiểu dữ liệu** — nếu bảng đang có
dữ liệu thì boot sẽ fail với lỗi `column "..." contains null values`. Đây chính là lỗi
gặp khi đồng bộ lại bảng `addresses` cũ; cách xử lý là drop bảng đó rồi để TypeORM tạo lại.
Trước khi lên production phải chuyển sang **migration** và tắt `synchronize`.

`src/config/database.config.ts` (đọc biến môi trường `DB_*`, tự tắt synchronize khi
`NODE_ENV=production`) đã có sẵn nhưng **chưa được app.module dùng** — nên nối vào bằng
`TypeOrmModule.forRootAsync` khi chuẩn bị deploy.

---

## 6. Việc còn lại (chưa làm)

- [ ] Nối `app.module.ts` với `getDatabaseConfig()` + file `.env`.
- [ ] Chuyển từ `synchronize` sang migration.
- [ ] **Index cho cột FK** — Postgres *không* tự tạo index khi thêm FOREIGN KEY.
      Thiếu index thì join và cascade delete sẽ chậm khi dữ liệu lớn. Thêm `@Index()`
      lên các cột FK + `products.slug`, `orders.order_code`…
- [ ] Chiều ngược `@OneToMany` nếu cần navigate 2 chiều.
- [ ] Auth (JWT) + guard cho các route ghi — hiện **mọi endpoint đều public**.
- [ ] Nghiệp vụ thật: đặt hàng, trừ tồn kho, áp voucher, webhook thanh toán.
  Các service hiện tại mới chỉ là CRUD thuần.
- [ ] Unit/e2e test cho từng module.

# CLAUDE.md — dodobanhang backend

Tài liệu thống nhất giữa Dat và Claude về cấu trúc database & code convention của backend.
Đọc file này trước khi thêm bảng / module mới.

Stack: **NestJS 10 + TypeORM 0.3 + PostgreSQL (Aiven Cloud)**.

⚠️ **Nguồn schema chính thức là `backend/erd.jpg`** (25 bảng, bản mới nhất).
File `../db_ecommerce.png` là bản CŨ, thiếu 4 bảng phân quyền — **đừng dùng nữa**.

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
| `RoleName` | CUSTOMER, ADMIN, WAREHOUSE_OPERATOR | `roles.name` |

Các cột `status` mà ERD **không** ghi giá trị (brands, categories, products, product_variants,
warehouses, vouchers, reviews) tạm để `varchar(20)` + `@IsString()` — chưa tự đặt ra giá trị.

---

## 3. 25 bảng đã tạo

| # | Bảng | Module | Route |
| --- | --- | --- | --- |
| 1 | `roles` | `role` | `/api/roles` |
| 2 | `users` | `user` | `/api/users` |
| 3 | `customers` | `customer` | `/api/customers` |
| 4 | `admins` | `admin` | `/api/admins` |
| 5 | `warehouse_operators` | `warehouse-operator` | `/api/warehouse-operators` |
| 6 | `addresses` | `address` | `/api/addresses` |
| 7 | `categories` | `category` | `/api/categories` |
| 8 | `brands` | `brand` | `/api/brands` |
| 9 | `products` | `product` | `/api/products` |
| 10 | `product_variants` | `product-variant` | `/api/product-variants` |
| 11 | `product_images` | `product-image` | `/api/product-images` |
| 12 | `warehouses` | `warehouse` | `/api/warehouses` |
| 13 | `inventories` | `inventory` | `/api/inventories` |
| 14 | `carts` | `cart` | `/api/carts` |
| 15 | `cart_items` | `cart-item` | `/api/cart-items` |
| 16 | `orders` | `order` | `/api/orders` |
| 17 | `order_items` | `order-item` | `/api/order-items` |
| 18 | `order_status_history` | `order-status-history` | `/api/order-status-history` |
| 19 | `shipments` | `shipment` | `/api/shipments` |
| 20 | `shipment_items` | `shipment-item` | `/api/shipment-items` |
| 21 | `payments` | `payment` | `/api/payments` |
| 22 | `payment_transactions` | `payment-transaction` | `/api/payment-transactions` |
| 23 | `vouchers` | `voucher` | `/api/vouchers` |
| 24 | `order_vouchers` | `order-voucher` | `/api/order-vouchers` |
| 25 | `reviews` | `review` | `/api/reviews` |

### 3.0. Phân quyền — 3 role

ERD có **3 role**: `CUSTOMER`, `ADMIN`, `WAREHOUSE_OPERATOR` (enum `RoleName`).
Mô hình: `users` giữ `role_id` → `roles`; mỗi role có một **bảng profile riêng dùng
chung khoá chính với `users`** (quan hệ 1-1, `user_id` vừa là PK vừa là FK):

| Role | Bảng profile | Cột riêng |
| --- | --- | --- |
| CUSTOMER | `customers` | `customer_code` U, `loyalty_points` int default 0 |
| ADMIN | `admins` | `employee_code` U, `department`, `position` |
| WAREHOUSE_OPERATOR | `warehouse_operators` | `warehouse_id` FK, `employee_code` U, `shift`, `status` |

`roles` là dữ liệu tham chiếu cố định và `users.role_id` là NOT NULL, nên
[role.seeder.ts](src/module/role/role.seeder.ts) tự nạp 3 role lúc app khởi động
(idempotent, dùng `ON CONFLICT DO NOTHING` dựa trên `UNIQUE(name)`).
Vì vậy `role.module.ts` có thêm provider `RoleSeeder` so với khuôn chung.

**Bẫy đã xử lý ở 3 bảng profile:** khoá chính do client truyền lên, mà
`repository.save()` với PK đã tồn tại là **UPDATE** chứ không phải INSERT — nghĩa là
`POST /api/admins` hai lần cùng `userId` sẽ âm thầm ghi đè. Cả 3 service đã kiểm tra
tồn tại trước và ném `ConflictException`. Nếu thêm bảng 1-1 mới, nhớ làm y hệt.

### 3.1. Khoá ngoại — 33 FK theo ERD

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
| `users` | `role_id` | `roles` | RESTRICT |
| `customers` | `user_id` (PK, `@OneToOne`) | `users` | CASCADE |
| `warehouse_operators` | `user_id` (PK, `@OneToOne`) | `users` | CASCADE |
| `warehouse_operators` | `warehouse_id` | `warehouses` | RESTRICT |
| `shipment_items` | `shipment_id` | `shipments` | CASCADE |
| `shipment_items` | `order_item_id` | `order_items` | RESTRICT |
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

### 3.2. UNIQUE & CHECK theo ERD

| Bảng | Ràng buộc |
| --- | --- |
| `cart_items` | `UNIQUE(cart_id, variant_id)` · `CHECK(quantity > 0)` |
| `inventories` | `UNIQUE(warehouse_id, variant_id)` |
| `order_vouchers` | `UNIQUE(order_id, voucher_id)` |
| `shipment_items` | `UNIQUE(shipment_id, order_item_id)` · `CHECK(quantity > 0)` |
| `order_items` | `CHECK(quantity > 0)` |
| `reviews` | `UNIQUE(order_item_id)` — mỗi order item chỉ được review 1 lần · `CHECK(rating BETWEEN 1 AND 5)` |
| `roles` | `UNIQUE(name)` |

DTO vẫn validate `@Min/@Max` nên client nhận **400** trước khi chạm DB; CHECK dưới DB
là lớp chặn cuối cho các đường ghi không qua API.

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

Database đã **host trên Aiven Cloud** (không còn dùng Postgres trong Docker cho dev).

```bash
cp .env.example .env      # rồi điền thông tin Aiven
npm install
npm run start:dev         # synchronize: true -> tự sinh/cập nhật bảng
# Swagger: http://localhost:3000/docs
# API:     http://localhost:3000/api/<route>
```

### Cấu hình kết nối

`app.module.ts` dùng `TypeOrmModule.forRootAsync` → [database.config.ts](src/config/database.config.ts),
đọc từ `.env`. Trước đây `app.module.ts` hardcode connection còn `database.config.ts`
bị bỏ không — nay đã gộp về một chỗ.

| Biến | Ghi chú |
| --- | --- |
| `DB_HOST` `DB_PORT` `DB_USERNAME` `DB_PASSWORD` | Aiven cấp |
| `DB_DATABASE` | tên DB. `DB_NAME` (tên cũ) vẫn được chấp nhận làm fallback |
| `DB_SSL` | tuỳ chọn, `true`/`false`. Mặc định **bật** khi host khác `localhost` |
| `DB_SSL_CA` | tuỳ chọn, nội dung `ca.pem` của Aiven |

**Về SSL:** chưa có `DB_SSL_CA` thì `rejectUnauthorized: false` — đường truyền vẫn được
mã hoá nhưng **không xác thực được danh tính server** (hở với tấn công MITM). Dev thì
chấp nhận được; production nên tải `ca.pem` từ Aiven console và đặt vào `DB_SSL_CA`.

`.env` đã nằm trong `.gitignore` — đừng commit.

**Đã verify trên Aiven (05/09/2026):** `npm run build` sạch, app boot không lỗi,
cloud DB có đủ **25 bảng · 33 FOREIGN KEY · 17 UNIQUE · 4 CHECK**, seeder nạp đúng
3 role. Smoke test đã chạy:

| Kịch bản | Kết quả |
| --- | --- |
| `GET /api/roles` | 3 role CUSTOMER / ADMIN / WAREHOUSE_OPERATOR |
| `POST /api/users` + `POST /api/customers` | 201, profile 1-1 gắn đúng user |
| `roleId` không tồn tại | 409 `Key (role_id)=(...) is not present in table "roles"` |
| `POST /api/admins` 2 lần cùng `userId` | 409 ConflictException (không còn ghi đè) |
| `DELETE /api/users/:id` | admin profile bị xoá theo (CASCADE) — GET trả 404 |
| `quantity: 0` | 400 từ DTO trước khi chạm CHECK dưới DB |
| Enum sai, slug trùng, xoá brand còn product | 400 / 409 / 409 |

### Lưu ý về `synchronize: true`

Đang bật (tắt tự động khi `NODE_ENV=production`). TypeORM **drop/add cột khi đổi kiểu
dữ liệu**, nên nếu bảng đang có dữ liệu thì boot sẽ fail hoặc mất cột. Giờ DB đã lên
cloud, rủi ro cao hơn hẳn so với lúc chạy Docker cục bộ — **chuyển sang migration
trước khi có dữ liệu thật**.

## 6. Việc còn lại (chưa làm)

- [ ] **Chuyển từ `synchronize` sang migration** — ưu tiên cao nhất vì DB đã lên cloud.
- [ ] Đặt `DB_SSL_CA` (ca.pem của Aiven) để xác thực đầy đủ chứng chỉ server.
- [ ] **Index cho cột FK** — Postgres *không* tự tạo index khi thêm FOREIGN KEY.
      Thiếu index thì join và cascade delete sẽ chậm khi dữ liệu lớn. Thêm `@Index()`
      lên các cột FK + `products.slug`, `orders.order_code`…
- [ ] Chiều ngược `@OneToMany` nếu cần navigate 2 chiều.
- [ ] Auth (JWT) + guard theo role (`RoleName`) — hiện **mọi endpoint đều public**,
      kể cả `POST /api/users` (ai cũng tạo được tài khoản ADMIN).
- [ ] `password_hash` hiện nhận chuỗi thô từ DTO — phải hash (bcrypt/argon2) trong service.
- [ ] Nghiệp vụ thật: đặt hàng, trừ tồn kho, áp voucher, webhook thanh toán.
  Các service hiện tại mới chỉ là CRUD thuần.
- [ ] Unit/e2e test cho từng module.

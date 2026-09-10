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
| Phạm vi mỗi bảng | **Full CRUD** phân tầng: entity → repository → service → controller, ghép bằng DI token | Giống hệt khuôn mẫu `src/module/address`. Xem mục 1.1 |
| Thời gian | `@CreateDateColumn` / `@UpdateDateColumn` kiểu `timestamptz`, cột `created_at` / `updated_at` | Timezone-aware; ERD chỉ ghi `timestamp` |
| Tên bảng | Số nhiều: `users`, `products`, `addresses`… | ERD ghi bảng là `address`, ta dùng `addresses` cho nhất quán. Ngoại lệ: `order_status_history` giữ nguyên như ERD |
| Tên thư mục module | Số ít, kebab-case: `product-variant/` | Theo mẫu `address/` |
| Route API | Số nhiều, kebab-case: `/api/product-variants` | |

### 1.1. Khuôn mẫu một module (bắt buộc giống nhau)

Kiến trúc phân tầng do Trung dựng (commit `9075d33 add base repo, uow, di`).
Controller **không** gọi thẳng class Service, Service **không** gọi thẳng class
Repository — tất cả đi qua **interface + DI token**, để sau này thay implementation
hoặc mock khi viết test mà không phải sửa tầng gọi.

```
src/module/<ten-module>/
  <ten-module>.module.ts                       # forFeature([Entity]) + bind token
  <ten-module>.controller.ts                   # @Inject(<X>_SERVICE) -> I<X>Service
  <ten-module>.service.ts                      # @Inject(<X>_REPOSITORY) -> I<X>Repository
  <ten-module>.repository.ts                   # extends BaseRepository<Entity>
  interface/<ten-module>-service.interface.ts
  interface/<ten-module>-repository.interface.ts
  dto/create-<ten-module>.dto.ts
  dto/update-<ten-module>.dto.ts                # extends PartialType(Create...Dto)
  entities/<ten-module>.entity.ts
```

Luồng phụ thuộc:

```
Controller --@Inject(ADDRESS_SERVICE)--> IAddressService
                                             ^
                                        AddressService --@Inject(ADDRESS_REPOSITORY)--> IAddressRepository
                                                                                              ^
                                                                          AddressRepository extends BaseRepository<Address>
```

Token khai báo sẵn cho cả 25 module trong
`src/common/dependency-injection/{service,repository}.tokens.ts` (kiểu `Symbol`),
và được bind trong `providers` của từng module:

```ts
providers: [
  { provide: ADDRESS_SERVICE, useClass: AddressService },
  { provide: ADDRESS_REPOSITORY, useClass: AddressRepository },
],
exports: [ADDRESS_SERVICE],   // export TOKEN, không export class
```

**Khi thêm module mới, đủ 4 bước:**

1. Thêm token vào `service.tokens.ts` và `repository.tokens.ts`
2. Viết 2 interface, repository kế thừa `BaseRepository`, service, controller
3. Bind token trong `providers`, export token
4. Thêm module vào mảng `imports` của `src/app.module.ts` — **thiếu bước này
   TypeORM sẽ không sinh bảng**

**Repository chỉ cần viết thêm khi có truy vấn riêng.** 5 thao tác CRUD đã nằm
trong `BaseRepository`; class con thường chỉ có constructor gọi `super()`.
Ví dụ `AdminRepository` thêm `findByUserId()` vì `admins` dùng khoá chính `userId`:

```ts
super(repository, 'Admin', 'userId');   // tham số 3 = tên cột khoá chính
```

---

## 2. Hạ tầng dùng chung

| File | Công dụng |
| --- | --- |
| `src/common/repository/base.repository.ts` | Lớp CRUD trừu tượng (`create/findAll/findOne/update/remove`) cho mọi repository. Tham số 3 của `super()` đổi được cột khoá chính (`'userId'` cho 3 bảng profile) |
| `src/common/dependency-injection/service.tokens.ts`<br>`src/common/dependency-injection/repository.tokens.ts` | Token `Symbol` cho cả 25 module, dùng để bind interface ↔ class. Xem mục 1.1 |
| `src/common/unit-of-work/unit-of-work.ts` | Bọc 1 transaction cho nghiệp vụ ghi nhiều bảng. Xem mục 2.1 |
| `src/common/transformers/numeric.transformer.ts` | Postgres `numeric` bị driver `pg` trả về **string**. Mọi cột tiền/khối lượng đều gắn `transformer: numericTransformer` để trả về `number` |
| `src/common/dto/pagination-query.dto.ts` | `?page=&limit=` cho mọi endpoint `findAll` |
| `src/common/enum/*.enum.ts` | Các enum lấy từ note trong ERD (xem bảng dưới) |
| `src/common/filters/http-exception.filter.ts` | Chuẩn hoá lỗi (catch-all) |
| `src/common/filters/database-error.mapper.ts` | Dịch mã lỗi ràng buộc Postgres → HTTP 4xx. **Không** tách thành filter riêng vì filter catch-all `@Catch()` luôn bắt trước, nên phải gọi mapper từ trong nó |
| `src/common/interceptors/transform-response.interceptor.ts` | Bọc response `{ data, statusCode, timestamp }` |

### 2.1. UnitOfWork — transaction cho nghiệp vụ nhiều bảng

`UnitOfWorkModule` là `@Global()` nên **inject thẳng `UnitOfWork` được ở mọi service,
không cần import module**. Dùng khi một nghiệp vụ phải ghi nhiều bảng và cần
"tất cả cùng thành công hoặc cùng rollback":

```ts
constructor(private readonly unitOfWork: UnitOfWork) {}

async placeOrder(dto: CreateOrderDto) {
  return this.unitOfWork.execute(async (manager) => {
    const orderRepo = this.unitOfWork.getRepository(manager, Order);
    const inventoryRepo = this.unitOfWork.getRepository(manager, Inventory);
    // ...
  });
}
```

⚠️ Bên trong `execute()` **bắt buộc** lấy repository qua
`unitOfWork.getRepository(manager, Entity)`. Nếu lỡ dùng repository đã inject sẵn
ở constructor, câu lệnh đó chạy **ngoài** transaction và sẽ không rollback theo.

Hiện chưa service nào dùng — sẽ cần khi làm đặt hàng, trừ tồn kho, áp voucher.

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

### 3 bảng profile — khác khuôn chung ở chỗ nào

`customers`, `admins`, `warehouse_operators` dùng **`user_id` làm khoá chính**
(lấy từ `users`, quan hệ 1-1), không tự sinh `id`. Kéo theo 4 điểm khác:

| | Bảng thường | 3 bảng profile |
| --- | --- | --- |
| Khoá chính | `id` uuid tự sinh | `user_id` uuid do client truyền |
| `super()` trong repository | `super(repo, 'X')` | `super(repo, 'X', 'userId')` |
| Route | `/:id` | `/:userId` |
| Update DTO | `PartialType(Create...)` | thêm `OmitType(..., ['userId'])` — không cho sửa khoá chính |

Riêng `admins`: ERD gốc ghi sai chính tả `postition`, code dùng `position`.

*(Ghi chú lịch sử: `admins` từng được coi là bảng ngoài ERD vì bản `db_ecommerce.png`
cũ không có nó. Bản `erd.jpg` mới có đủ cả 3 bảng profile.)*

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

Ràng buộc `CHECK` trong ERD (`quantity > 0`, `rating 1-5`) **đã tạo dưới DB** bằng
`@Check()` — xem mục 3.2. DTO vẫn validate `@Min`/`@Max` để client nhận 400 sớm.

---

## 5. Chạy & kiểm thử

Database đã **host trên Aiven Cloud** (không còn dùng Postgres trong Docker cho dev).

```bash
cp .env.example .env      # rồi điền thông tin Aiven
npm install
npm run start:dev         # synchronize: true -> tự sinh/cập nhật bảng
# Swagger: http://localhost:3000/swagger/index.html
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

### Đường dẫn Swagger đã đổi

`main.ts` gọi `SwaggerModule.setup('/swagger/index.html', ...)` với
`jsonDocumentUrl: '/swagger-json'`. Đường cũ `/docs` và `/docs-json` **không còn dùng được**.

| | |
| --- | --- |
| Swagger UI | `http://localhost:3000/swagger/index.html` |
| OpenAPI JSON | `http://localhost:3000/swagger-json` |

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

## 5.1. Sự cố đã gặp — đọc trước khi đổi entity

### 10/09/2026 — mất cột `users.role_id`, app không boot được

**Triệu chứng.** Boot lên báo `Unable to connect to the database. Retrying (1..10)`
rồi chết. Đây là **thông báo gây hiểu nhầm** — TypeORM gộp mọi lỗi lúc
`initialize()` vào message đó. Lỗi thật nằm ở dòng ngay trên:

```
query failed: ALTER TABLE "users" ADD "role_id" uuid NOT NULL
error: column "role_id" of relation "users" contains null values
```

**Nguyên nhân.** Lúc đó `main` và `trung` có `user.entity.ts` **không có** `role_id`,
còn `dev`/`dodo` thì **có**. Cả nhóm dùng chung một DB Aiven với `synchronize: true`
— mà synchronize **xoá luôn cột nào không có trong entity**. Ai đó chạy nhánh `main`
→ `role_id` bị drop; sau đó tạo 1 tài khoản; rồi chạy nhánh có `role_id` → TypeORM
cố thêm lại cột `NOT NULL` trên bảng đã có dữ liệu → Postgres từ chối.

**Điểm mấu chốt:** không phải lỗi của code-first hay của TypeORM. Thêm cột `NOT NULL`
vào bảng đã có dòng thì dòng cũ phải nhận giá trị gì — không công cụ nào tự đoán được.
EF Core, Prisma, Hibernate đều dừng y hệt. Chính cột này ngày 05/09 tạo trơn tru vì
lúc đó bảng **rỗng**.

`synchronize` chỉ tự động được khi thao tác **không cần quyết định về dữ liệu**:
thêm bảng mới, thêm cột nullable, thêm cột có `default`.

**Đã xử lý.** Xoá dòng dữ liệu test (`DELETE FROM users`) rồi boot lại → synchronize
thêm cột bình thường. Các PR #12–#14 đã đồng bộ `role_id` cho cả 4 nhánh nên
tình huống này không lặp lại vì lý do cũ nữa.

**Quy ước rút ra:**

1. **Trước khi sửa/xoá cột trong entity, báo cả nhóm.** DB dùng chung — sửa entity
   là sửa schema của mọi người.
2. **Đừng merge nhánh có entity lệch nhau.** Nhánh nào thêm cột thì merge lên `dev`
   sớm, để không có hai phiên bản entity cùng chạy vào một DB.
3. **Thêm cột NOT NULL vào bảng đã có dữ liệu** thì phải làm tay 3 bước:
   ```sql
   ALTER TABLE <bang> ADD COLUMN <cot> <kieu>;          -- nullable truoc
   UPDATE <bang> SET <cot> = <gia_tri_mac_dinh>;         -- backfill
   ALTER TABLE <bang> ALTER COLUMN <cot> SET NOT NULL;   -- roi moi siet
   ```
   Hoặc cho cột `nullable` / có `default` để synchronize tự làm được.
4. **Khi thấy "Unable to connect to the database"** — đừng đi kiểm tra mạng hay
   `.env` vội. Kéo log lên xem dòng `query failed:` phía trên trước.

---

## 6. Việc còn lại (chưa làm)

- [ ] **Chuyển từ `synchronize` sang migration** — ưu tiên cao nhất vì DB đã lên cloud.
- [ ] Đặt `DB_SSL_CA` (ca.pem của Aiven) để xác thực đầy đủ chứng chỉ server.
- [ ] **Index cho cột FK** — Postgres *không* tự tạo index khi thêm FOREIGN KEY.
      Thiếu index thì join và cascade delete sẽ chậm khi dữ liệu lớn. Thêm `@Index()`
      lên các cột FK + `products.slug`, `orders.order_code`…
- [ ] Chiều ngược `@OneToMany` nếu cần navigate 2 chiều.
- [ ] **Tách DB riêng cho từng dev** (Aiven cho tạo thêm database trên cùng service,
      mỗi người đổi `DB_DATABASE` trong `.env`) — cách rẻ nhất để hết hẳn cảnh
      `synchronize` của người này phá schema người kia. Xem mục 5.1.
- [ ] Auth (JWT) + guard theo role (`RoleName`) — hiện **mọi endpoint đều public**,
      kể cả `POST /api/users` (ai cũng tạo được tài khoản ADMIN).
- [ ] `password_hash` hiện nhận chuỗi thô từ DTO — phải hash (bcrypt/argon2) trong service.
- [ ] Nghiệp vụ thật: đặt hàng, trừ tồn kho, áp voucher, webhook thanh toán.
  Các service hiện tại mới chỉ là CRUD thuần.
- [ ] Unit/e2e test cho từng module.

---
name: backend-module
description: Quy ước NestJS + TypeORM của backend dodobanhang. Dùng khi thêm/sửa entity, module, controller, service, repository, DTO, route API, FK, enum, hoặc nghiệp vụ nhiều bảng (UnitOfWork) trong backend/.
---

# Backend module (NestJS 10 + TypeORM 0.3 + Postgres Aiven)

Chi tiết đầy đủ: `backend/backend.md`. **Chỉ đọc mục cần** (Grep tiêu đề `^## ` / `^### ` rồi Read đúng khoảng dòng), không đọc cả file.
Schema chính thức: `backend/erd.jpg` (25 bảng). `db_ecommerce.png` là bản cũ, bỏ qua.

## Quy ước entity

- PK: `@PrimaryGeneratedColumn('uuid') id: string`.
- Cột: khai báo `type` + `length/precision` đúng ERD + `name: 'snake_case'`; property TS camelCase.
- FK: giữ **cả** cột uuid thô và quan hệ:
  ```ts
  @Column({ type: 'uuid', name: 'user_id' }) userId: string
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user: User
  ```
  ON DELETE: CASCADE (con vô nghĩa khi mất cha), RESTRICT (chứng từ cần lưu vết), SET NULL (chỉ cột nullable). Bảng FK hiện có: backend.md mục 3.1.
- Thời gian: `@CreateDateColumn/@UpdateDateColumn` `timestamptz`, cột `created_at/updated_at`.
- Cột `numeric` → `transformer: numericTransformer` (driver `pg` trả string).
- Bảng số nhiều (`product_variants`), thư mục module số ít kebab (`product-variant/`), route số nhiều kebab (`/api/product-variants`).
- Enum chỉ tạo khi ERD ghi rõ giá trị (`src/common/enum/`); status không rõ giá trị → `varchar(20)`.
- UNIQUE/CHECK theo ERD bằng `@Unique/@Check`; DTO vẫn `@Min/@Max` để trả 400 sớm.

## Khuôn module (bắt buộc, mẫu: `src/module/address/`)

```
<m>.module.ts | <m>.controller.ts | <m>.service.ts | <m>.repository.ts (extends BaseRepository)
interface/<m>-service.interface.ts | interface/<m>-repository.interface.ts
dto/create-<m>.dto.ts | dto/update-<m>.dto.ts (PartialType) | entities/<m>.entity.ts
```

Controller `@Inject(X_SERVICE)` → `IXService`; Service `@Inject(X_REPOSITORY)` → `IXRepository`. Không inject class trực tiếp.

Thêm module mới, đủ 4 bước:
1. Token vào `src/common/dependency-injection/{service,repository}.tokens.ts`.
2. 2 interface + repository + service + controller.
3. `providers: [{ provide: X_SERVICE, useClass: XService }, ...]`, `exports: [X_SERVICE]` (export token).
4. Thêm module vào `imports` của `src/app.module.ts` (thiếu → không sinh bảng).

Repository chỉ viết thêm khi có truy vấn riêng. Bảng profile 1-1 (`customers/admins/warehouse_operators`): `super(repo, 'X', 'userId')`, route `/:userId`, Update DTO `OmitType(..., ['userId'])`, service phải kiểm tra tồn tại trước khi tạo → `ConflictException` (vì `save()` với PK có sẵn là UPDATE).

## Bẫy hay gặp

- Route tĩnh (`search`, `slug/:slug`, `public`, `me/...`) **khai báo trước `:id`**, nếu không `ParseUUIDPipe` trả 400.
- Nghiệp vụ nhiều bảng: `unitOfWork.execute(async (manager) => ...)` và **bắt buộc** lấy repo qua `unitOfWork.getRepository(manager, Entity)` bên trong (repo inject sẵn chạy ngoài transaction).
- Response luôn được interceptor bọc `{ data, statusCode, timestamp }`; lỗi Postgres được `database-error.mapper.ts` dịch sang 4xx.
- Endpoint cần đăng nhập: `@UseGuards(JwtAuthGuard, RolesGuard)` (mẫu `src/module/cart/my-cart.controller.ts`, route `/api/cart/me`).
- Public endpoint chỉ trả bản ghi `status = 'ACTIVE'` (`PUBLIC_STATUS` trong `product/product.constants.ts`).
- Password: luôn hash; ID token Google / JWT xem skill `auth-flow`.

**Đổi cột/entity** → dùng skill `db-safety` trước (DB Aiven dùng chung, `synchronize: true`).

Kiểm tra: `cd backend && npm run build`. Swagger: `http://localhost:3000/swagger/index.html`.
Sau khi thay đổi quy ước/endpoint: cập nhật `backend/backend.md` (mục tương ứng) và skill này nếu quy tắc đổi.

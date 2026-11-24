# dodobanhang — tổng quan repo

Monorepo 2 project độc lập, mỗi project có `package.json` riêng. **Chạy `npm` trong từng folder**
(gốc repo không có `package.json`).

| Folder | Stack | Tài liệu gốc (lớn, chỉ đọc mục cần) |
| --- | --- | --- |
| `backend/` | NestJS 10 + TypeORM 0.3 + PostgreSQL (Aiven, dùng chung cả nhóm) | `backend/backend.md` |
| `frontend/` | Next.js 16 (App Router) + React 19 + Tailwind 4 | `frontend/frontend.md` (+ `frontend/AGENTS.md`: không sửa/xoá) |

## Cách lấy context (tiết kiệm token)

Quy ước đã được tách thành skill trong `.claude/skills/`, tự nạp theo việc đang làm:

| Skill | Khi nào |
| --- | --- |
| `backend-module` | entity, module, controller, DTO, FK, UnitOfWork |
| `db-safety` | đổi cột/bảng, seed, boot vào Aiven, lỗi "Unable to connect" |
| `frontend-feature` | trang, component, form, routing, Server/Client Component |
| `brand-ui` | màu, Tailwind, layout, card, header/banner |
| `api-connect` | gọi endpoint backend từ frontend, thêm endpoint mới, giỏ hàng |
| `auth-flow` | đăng ký/đăng nhập/Google/JWT/hồ sơ |
| `run-dev` | chạy, build, kiểm thử app |

- **Không đọc cả `backend.md` / `frontend.md`.** Khi skill không đủ: Grep tiêu đề (`^## `, `^### `) hoặc
  tên component trong file đó, rồi Read đúng khoảng dòng.
- Tìm kiếm rộng nhiều file: dùng agent `Explore` để kết quả thô không chiếm context chính.
- Sau khi đổi quy ước/endpoint: cập nhật mục tương ứng trong tài liệu gốc, và skill nếu quy tắc đổi.

## Ghép frontend ↔ backend

```bash
cd backend  && npm run start:dev   # http://localhost:3000/api  (Swagger: /swagger/index.html)
cd frontend && npm run dev         # http://localhost:3001
```

| | Quyết định |
| --- | --- |
| Cổng | Backend **3000** (cố định vì `GOOGLE_CALLBACK_URL`), frontend **3001** |
| Cấu hình frontend | `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api` |
| URL sản phẩm | `/products/<slug>`, lọc `?category=<slug>` |
| Giá "Liên hệ" | `product_variants.price` nullable, `null` = "Liên hệ" |
| Đã nối | sản phẩm, danh mục, liên hệ, auth (email + Google), hồ sơ, giỏ hàng (`/api/cart/me`) |
| Vẫn hardcode ở frontend | dịch vụ, đánh giá trang chủ |
| Thương hiệu | **dodobanhang** (con dodo): `#0F3D3E` chính, `#FFD66B` nhấn, `#FF6B4A` cam, `#FFF8EC` kem |

⚠️ **DB Aiven dùng chung + `synchronize: true`**: sửa entity là sửa schema của cả nhóm. Trước khi
bật `SEED_CATALOG=true` trên Aiven phải báo nhóm và merge `price` nullable lên `dev`. `SEED_TIKI` chỉ
dùng DB local/test. Chi tiết: skill `db-safety`.

## Git

- `.gitignore` riêng cho từng project. Không commit `node_modules/`, `.next/`, `.env*`.
- File trong `frontend/` là CRLF; Prettier đổi sang LF → chỉ format file mình sửa.

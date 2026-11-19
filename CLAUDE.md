# dodobanhang — tổng quan repo

Monorepo gồm 2 project độc lập, mỗi project có `package.json` riêng. **Chạy `npm` bên trong từng
folder**, không chạy ở gốc repo (gốc không có `package.json`).

| Folder | Stack | Tài liệu chi tiết |
| --- | --- | --- |
| `backend/` | NestJS 10 + TypeORM 0.3 + PostgreSQL (Aiven) | [backend/backend.md](backend/backend.md) |
| `frontend/` | Next.js 16 (App Router) + React 19 + Tailwind 4 | [frontend/frontend.md](frontend/frontend.md) (+ [frontend/AGENTS.md](frontend/AGENTS.md)) |

**Trước khi sửa code trong folder nào, đọc tài liệu của folder đó.** Hai file trên không tên là
`CLAUDE.md` nên không tự được nạp; file này là điểm vào duy nhất.

- Làm ở `frontend/`: đọc `frontend/frontend.md` **và** `frontend/AGENTS.md` (quy tắc Next.js 16 do
  `next dev` quản lý: không sửa, không xóa file này).
- Làm ở `backend/`: đọc `backend/backend.md` (quy ước entity/module, FK, sự cố `synchronize`).

## Ghép frontend ↔ backend (đã nối 17/11/2026)

Chạy cả hai cùng lúc (2 terminal):

```bash
cd backend  && npm run start:dev   # http://localhost:3000/api  (Swagger: /swagger/index.html)
cd frontend && npm run dev         # http://localhost:3001
```

| | Quyết định |
| --- | --- |
| Cổng | Backend **3000** (giữ nguyên vì `GOOGLE_CALLBACK_URL` đã đăng ký với Google), frontend **3001** |
| Cấu hình frontend | `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api` |
| URL sản phẩm | `/products/<slug>` (slug trong DB), lọc nhóm `?category=<slug>` |
| Giá "Liên hệ" | `product_variants.price` nullable, `null` = "Liên hệ" |
| Đã nối | sản phẩm, nhóm sản phẩm (`/api/products/search`, `/api/products/slug/:slug`, `/api/categories/public`), form liên hệ (`POST /api/contacts`, gửi email, không lưu DB), đăng ký / xác thực email / đăng nhập (`/api/auth/*`, 18/11/2026) |
| Đăng nhập trên web | Email/mật khẩu + **Google** (`POST /api/auth/google`, nút Google Identity Services; cần `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `GOOGLE_CLIENT_ID` backend và origin `http://localhost:3001` trong Google Console). JWT lưu `localStorage`, `AuthProvider` bọc toàn site (`frontend/src/features/auth/`); trang `/register`, `/verify-email`, `/login`, `/account` |
| Thương hiệu | **dodobanhang** (con dodo). Màu theo bộ nhận diện (19/11/2026): xanh cổ vịt `#0F3D3E` (chính), vàng `#FFD66B` (nhấn), cam `#FF6B4A`, kem `#FFF8EC`. Header: logo + Menu + nút vàng "Tài khoản" (bỏ tìm kiếm, SĐT). Ảnh hero/banner bản "Mua sắm cùng dodo. Đặt hàng ngay." (nút → `/products`). Chi tiết: `frontend/frontend.md` mục "Styling" và "Layout đã dựng" |
| Vẫn hardcode ở frontend | dịch vụ, đánh giá trang chủ |
| Dữ liệu ban đầu | `SEED_CATALOG=true` trong `backend/.env` → nạp 5 nhóm + 13 sản phẩm thật (1 lần) |

Chi tiết: `backend/backend.md` mục 7 (auth: 7.6), `frontend/frontend.md` mục "Nối backend" và "Đăng ký / đăng nhập".

⚠️ **Trước khi bật `SEED_CATALOG=true` trên Aiven**, phải báo cả nhóm và merge thay đổi
`price` nullable lên `dev`. Nếu không, nhánh nào còn `price` NOT NULL sẽ không boot được
(`backend/backend.md` mục 5.1 và 7.4).

## Git

- Mỗi project có `.gitignore` riêng (`backend/.gitignore`, `frontend/.gitignore`); `.gitignore` ở
  gốc repo chỉ chặn `/node_modules` của gốc. Không commit `node_modules/`, `.next/`, `.env*`.
- File trong `frontend/` đang là CRLF; Prettier đổi sang LF → chỉ format file mình sửa
  (xem `frontend/frontend.md`, mục "Quy ước code").

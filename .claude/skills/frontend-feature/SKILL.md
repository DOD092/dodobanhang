---
name: frontend-feature
description: Quy ước code frontend dodobanhang (Next.js 16 App Router, React 19, TypeScript). Dùng khi tạo/sửa trang trong frontend/src/app, component, feature, type, form (React Hook Form + Zod), routing, ảnh next/image, Server/Client Component.
---

# Frontend (Next.js 16 + React 19 + Tailwind 4)

Chi tiết: `frontend/frontend.md` (~90 KB, **không đọc cả file**: Grep tên component/tiêu đề `^## ` rồi Read đúng đoạn).
Next.js 16 khác dữ liệu huấn luyện: trước khi dùng API Next lạ, đọc guide liên quan trong `frontend/node_modules/next/dist/docs/` (theo `frontend/AGENTS.md`; **không sửa/xoá AGENTS.md**).

## Cấu trúc `frontend/src/`

`app/` routing · `components/<area>/` UI · `features/<domain>/xxxAPI.ts` hàm dữ liệu · `types/` (1 entity/file) · `apis/client.ts` + `apis/server.ts` · `utils/` · `config/site.ts` (thông tin công ty, `navItems` menu), `config/home.ts`.
**Không tạo `src/pages/`.**

## Quy tắc bắt buộc

1. Dữ liệu trang: **Server Component `async`** gọi hàm trong `features/<domain>/xxxAPI.ts`. Không `useEffect + fetch`. Trang/component không import `xxxData.ts` hay tự `fetch`.
2. State UI: `useState`/`useContext`; không Redux. Component dùng hook/browser API → `'use client'`; mặc định Server Component.
3. File `'use client'` **chỉ export component** (hằng/hàm dùng chung đặt file thường).
4. Compound component qua ranh giới server/client: named export + `import * as Foo` (không `export default { Root, Panel }`).
5. Link: `next/link`; URL hiện tại `usePathname()`.
6. Form: React Hook Form + Zod 4 (`z.email()`), `useForm<Input, unknown, Output>` + `zodResolver`, `noValidate`, input class `.form-input`, lỗi `is-invalid` + `<p className="text-red-600">` + `aria-invalid/aria-describedby`. Mẫu: `components/contact/ContactForm.tsx`.
7. Ảnh: `next/image` (không `<img>`, trừ avatar domain ngoài). `fill` cần cha `relative` + `sizes`. Next 16 bỏ `priority` → `preload` / `loading="eager"`. Domain ngoài khai báo `images.remotePatterns` trong `next.config.ts`.
8. Root layout đã bọc `<main>` + `AuthProvider` + `CartProvider`: trang con dùng `<div className="container py-5">`, không tự bọc `<main>`.
9. `loading.tsx` bọc mọi route con cùng cấp → `notFound()` thành soft 404. Đặt loading trong route group (như `app/products/(list)/`).
10. Danh sách phải chịu được 0 / 1 / số lẻ / nội dung dài; không viết cứng số lượng trong câu chữ.
11. URL: sản phẩm `/products/<slug>` (`productPath()`), lọc `?category=<slug>`; dữ liệu hardcode có id số (dịch vụ) dùng `slugPath()/slugParam()` dạng `<slug>-<id>`. Không tự ghép `/x/${id}`.
12. Tên file/folder tiếng Anh (component `PascalCase.tsx`, data/API `camelCase.ts`), chữ hiển thị tiếng Việt.

## Code style

- Prettier: không `;`, nháy đơn, width 100, `trailingComma: es5`.
- **File repo là CRLF, Prettier đổi sang LF**: chỉ `npx prettier --write <file đã sửa>`, **không** `npm run format`.
- Import: package ngoài → dòng trống → `@/...`/tương đối. Dùng alias `@/`.

## Kiểm tra

`cd frontend && npm run build` (type check; cần mạng vì `next/font`). Dev: cổng 3001, cần backend chạy (skill `run-dev`).
Giao diện/màu: skill `brand-ui`. Gọi API: skill `api-connect`. Đăng nhập: skill `auth-flow`.
Sau khi thêm trang/component lớn: cập nhật mục tương ứng trong `frontend/frontend.md`.

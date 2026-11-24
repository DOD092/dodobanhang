---
name: brand-ui
description: Giao diện và thương hiệu dodobanhang (Tailwind 4 thuần, màu dodo, kiểu khung, header/footer/banner). Dùng khi làm UI, chỉnh màu, CSS, globals.css, layout, card, nút, responsive, icon, ảnh hero/banner trong frontend/.
---

# Brand & UI — Tailwind 4 thuần

**Chỉ Tailwind**, không Bootstrap/UI lib/thư viện icon. Cấu hình bằng CSS trong `frontend/src/app/globals.css` (không có `tailwind.config.js`).
Chi tiết từng component: Grep tên component trong `frontend/frontend.md` (mục "Layout đã dựng", "Styling", "Trang sản phẩm kiểu sàn TMĐT").

## Màu (token `@theme`)

| Token | Hex | Dùng |
| --- | --- | --- |
| `brand-primary` | `#0f3d3e` xanh cổ vịt | màu chính, khối nền tối (footer, CTA, banner) |
| `brand-primary-dark` | `#0a2b2c` | hover |
| `brand-primary-light` | `#fff8ec` kem | nền nhạt |
| `brand-accent` | `#ffd66b` vàng | nút trên nền xanh ("Tài khoản"), viền/icon nhấn |
| `brand-accent-dark` | `#f5c544` | hover vàng |
| `brand-coral` | `#ff6b4a` cam | nhấn phụ |

Chữ "banhang" ở logo: `#B3361A`. Giá bán / lỗi form: `red-600`. Trên nền xanh dùng vàng (xanh trên xanh không thấy).
Mô tả "đỏ"/"đen" cũ trong frontend.md = `brand-primary` hiện nay.

## Quy tắc

- Class dùng chung trong `@layer components`: `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-outline-secondary`, `.btn-outline-light`, `.btn-light`, `.form-input`, `.is-invalid`. Chỉ thêm class mới khi lặp ≥ 3 nơi; còn lại viết utility trực tiếp.
- `container` đã định nghĩa lại bằng `@utility container` (giữa, max 80rem, đệm 1rem/1.5rem). Không viết `@layer utilities { .container }`.
- Không thêm rule thẻ trần (`a {}`, `h2 {}`) vào components/utilities; style mặc định thẻ đặt `@layer base`.
- Tên class v4: `bg-linear-to-r`, `aspect-4/3`, `size-*`, `md:h-112`.
- Breakpoint mặc định (sm 640, md 768, lg 1024, xl 1280).
- Kiểu khung trắng chung: `border-2 border-b-4 border-neutral-300 shadow-md`; thẻ bấm được thêm `hover:-translate-y-1 hover:border-b-brand-primary hover:shadow-xl`; khung nhấn thêm `border-t-4 border-t-brand-primary`.
- Thẻ có link phủ cả thẻ: `after:absolute after:inset-0` trên link, cha `relative`; nút phụ bên trong `relative z-10`.
- Animate chiều cao: `grid` + `grid-rows-[0fr]` ↔ `grid-rows-[1fr]`, `overflow-hidden` đặt ở **grid item**, không ở container.
- Ảnh sản phẩm: `object-contain p-1 bg-neutral-100` (không `object-cover`).
- Icon: thêm SVG vào `components/common/Icons.tsx` (`currentColor`, `className="size-*"`, path Lucide).
- `hover:` của Tailwind 4 chỉ chạy trên thiết bị có hover → mobile phải hiện sẵn nội dung.

## Header / ảnh

- Header 1 hàng, `sticky top-0 z-50`: Logo (dodo `brand/dodo-mark.png` + "dodo" "banhang") | Menu (`navItems`) | giỏ hàng + nút vàng "Tài khoản". Không có tìm kiếm/SĐT.
- `HeroBanner`: `hero.png` (≥640px) / `hero-square.png`, nút trong ảnh = `HOTSPOTS` tọa độ %; đổi ảnh phải đo lại. Thay ảnh trùng tên → xoá `frontend/.next/dev/cache/images` + Ctrl+F5.
- Banner trang con: `ImageBanner` + `banner-bg.png` (`object-right`).

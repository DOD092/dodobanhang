---
name: api-connect
description: Nối frontend dodobanhang với backend NestJS (fetch, apiRequest, serverGet, ApiError, envelope data, token Bearer, CORS, ảnh /uploads). Dùng khi gọi một endpoint backend từ frontend, thêm hàm vào features/*/xxxAPI.ts, thêm endpoint public mới, hoặc làm giỏ hàng/sản phẩm/danh mục/liên hệ.
---

# Frontend ↔ backend

- Backend `http://localhost:3000/api` (cổng cố định, `GOOGLE_CALLBACK_URL`), frontend `:3001`.
- `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api` (nhúng lúc build; đổi phải chạy lại dev).

## Luồng code

```
page / component
  └─ features/<domain>/xxxAPI.ts   (1 hàm = 1 endpoint, trả type trong types/)
       ├─ apis/server.ts  serverGet()    Server Component; gọi connection() → trang render theo request
       └─ apis/client.ts  apiRequest()   client hoặc server; bóc envelope, lỗi → ApiError(status, message)
```

- Response backend luôn `{ data, isSuccess, message, statusCode, timestamp }`; chỉ dùng `data` sau khi bóc.
- Type frontend khớp DTO backend, **camelCase** (`types/Product.ts`, `types/Category.ts`, ...).
- API cần đăng nhập: truyền `token` từ `useAuth()` → header `Authorization: Bearer <token>`. 401 → `logout()` + `/login`.
- Backend chặn field lạ (whitelist) → không gửi field rỗng/thừa (vd bỏ `confirmPassword`, `phone` rỗng).
- Hiện lỗi: dùng `ApiError.message` của backend (đã là tiếng Việt).
- Ảnh: `/images/...` = tĩnh frontend; `/uploads/...` = backend → `resolveImageUrl()` / `productImages()` (`utils/imageUrl.ts`). Domain ngoài (tikicdn) khai báo `remotePatterns`.

## Endpoint đã nối

| Endpoint | Hàm frontend |
| --- | --- |
| `GET /products/search` (`q, category, minPrice, maxPrice, minRating, sort, page, limit`) | `searchProducts()` — query qua `features/product/productQuery.ts` |
| `GET /products/slug/:slug` | `getProductBySlug()` |
| `GET /categories/public` (kèm `parentId`, `imageUrl`, `productCount`) | `getCategories()`, cây: `utils/categoryTree.ts` |
| `POST /contacts` (429 sau 5 lần/10 phút) | `createContact()` |
| `/auth/*`, `/customers/me/profile`, `/customers/me/avatar` | xem skill `auth-flow` |
| `GET /cart/me`, `POST /cart/me/items`, `PATCH|DELETE /cart/me/items/:itemId` (JWT) | `features/cart/cartAPI.ts` (`getMyCart, addToCart, updateCartItem, removeCartItem`), state ở `CartProvider` |

| `GET/POST /addresses/me` (JWT) | `features/address/addressAPI.ts` |
| `POST /orders/me/checkout` (COD / PAYOS → `checkoutUrl`), `GET /orders/me`, `GET /orders/me/:orderCode` (đối soát payOS), `POST /orders/me/:orderCode/cancel` (JWT) | `features/order/orderAPI.ts` (trang `/checkout`, `/checkout/result`, `/account/orders/<mã>`) |
| `POST /payments/payos/webhook` (payOS gọi, công khai, verify chữ ký) | — (backend.md 7.9) |

Vẫn hardcode (chủ dự án chọn): dịch vụ `serviceData.ts`, đánh giá trang chủ `reviewData.ts`, `config/home.ts`.

## Thêm endpoint mới (2 phía)

1. Backend: DTO + service + controller theo skill `backend-module`; route tĩnh trước `:id`; public thì lọc `ACTIVE`.
2. Frontend: type trong `types/`, hàm trong `features/<domain>/xxxAPI.ts`, trang gọi hàm đó.
3. Cập nhật bảng "Đã nối" trong `CLAUDE.md`, backend.md mục 7, frontend.md mục "Nối backend".

Backend tắt → các trang dùng dữ liệu backend lỗi (chưa có `error.tsx`).

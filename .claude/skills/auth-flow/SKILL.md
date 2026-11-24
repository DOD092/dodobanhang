---
name: auth-flow
description: Đăng ký, xác thực email, đăng nhập (email/mật khẩu + Google), quên/đổi mật khẩu, hồ sơ & avatar, JWT, AuthProvider, guard theo role của dodobanhang. Dùng khi sửa trang /login /register /verify-email /forgot-password /account, module auth backend, hoặc bất cứ API nào cần đăng nhập.
---

# Auth

Chi tiết: backend `backend/backend.md` mục 7.6 · frontend `frontend/frontend.md` mục "Đăng ký / đăng nhập" (Grep tiêu đề, đọc đúng đoạn).

## Luồng

```
app/{register,verify-email,login,forgot-password,account}
  └─ components/auth/*Form         Zod (features/auth/authSchema.ts), bắt ApiError, router.push
       └─ features/auth/AuthProvider.tsx   useAuth(): user, token, loading, login, loginWithGoogle, logout, refreshUser
            └─ features/auth/authAPI.ts     1 hàm / endpoint
```

| Bước | Endpoint | Ghi chú |
| --- | --- | --- |
| Đăng ký | `POST /auth/register` | → `/verify-email?email=` ; 409 email trùng |
| Xác thực | `POST /auth/verify-email` (mã 6 số, 5 phút) | chỉ tài khoản `INACTIVE` + còn `verificationCode` |
| Gửi lại mã | `POST /auth/resend-verification-code` | cách nhau ≥ 60s → 429 "Vui lòng đợi N giây..." (frontend đọc N) |
| Đăng nhập | `POST /auth/login` → `{ accessToken }` | 401 sai (cùng 1 câu); 403 "chưa xác thực" → frontend chuyển `/verify-email` (dựa vào chữ "xác thực") |
| Google | `POST /auth/google` (ID token từ GIS) | tự tạo customer, không cần mã |
| Me | `GET /auth/me` (Bearer) | `CurrentUser` |
| Quên MK | `POST /auth/forgot-password`, `/auth/reset-password` | luôn trả cùng 1 câu (không lộ email) |
| Đổi MK | `POST /auth/change-password` (Bearer) | MK mới ≠ cũ; tài khoản chỉ Google → 400 |
| Hồ sơ | `GET/PATCH /customers/me/profile`, `PATCH /customers/me/avatar` (`FormData` field `avatar`) | chỉ role `CUSTOMER` |

## Quy tắc an toàn (đã từng sai, đừng lặp lại)

- `AuthService.login`: kiểm tra mật khẩu **trước** trạng thái; `throw 401` nằm trong `if (!user || !isMatch)`.
- verify/resend không được mở khoá tài khoản bị admin khoá (`isPendingVerification`).
- Mật khẩu `@MaxLength(72)` (bcrypt). Upload: đuôi file lấy theo mimetype đã lọc, không theo `originalname`.
- Redirect sau đăng nhập (`?next=`) qua `utils/safeRedirect.ts` (chống open redirect).
- JWT lưu `localStorage` (demo); stateless, chưa thu hồi khi đổi MK/đăng xuất.
- `/account` chặn ở client chỉ là UX; bảo vệ thật là guard backend (`JwtAuthGuard`, `RolesGuard`, enum `RoleName`).

## Cấu hình

`NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend) = `GOOGLE_CLIENT_ID` (backend); Google Console phải có origin `http://localhost:3001`. Thiếu `MAIL_*` → không có mail, lấy mã ở cột `users.verification_code` để test.

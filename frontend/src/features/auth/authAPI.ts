import { apiPost, apiRequest, buildApiUrl } from '@/apis/client'
import type { CurrentUser, GoogleAuthResult, LoginPayload, RegisterPayload } from '@/types/Auth'

export function register(payload: RegisterPayload) {
  return apiPost<{ userId: string; email: string }>('/auth/register', payload)
}

export function verifyEmail(email: string, verificationCode: string) {
  return apiPost<{ message: string }>('/auth/verify-email', { email, verificationCode })
}

export function resendVerificationCode(email: string) {
  return apiPost<{ message: string }>('/auth/resend-verification-code', { email })
}

// Luôn trả cùng 1 câu dù email có tồn tại hay không (backend không lộ email nào đã đăng ký)
export function forgotPassword(email: string) {
  return apiPost<{ message: string }>('/auth/forgot-password', { email })
}

export function resetPassword(email: string, passwordResetCode: string, newPassword: string) {
  return apiPost<{ message: string }>('/auth/reset-password', {
    email,
    passwordResetCode,
    newPassword,
  })
}

export function login(payload: LoginPayload) {
  return apiPost<{ accessToken: string }>('/auth/login', payload)
}

// `credential` = ID token Google Identity Services trả về (response.credential). Backend tự verify
// chữ ký + audience (GOOGLE_CLIENT_ID); chưa có tài khoản thì tạo customer mới (không cần mã email).
export function loginWithGoogle(credential: string) {
  return apiPost<GoogleAuthResult>('/auth/google', { credential })
}

// Cần đăng nhập. Tài khoản chỉ có Google (chưa có mật khẩu) -> 400, hướng dẫn dùng "Quên mật khẩu"
export function changePassword(
  token: string,
  payload: { currentPassword: string; newPassword: string }
) {
  return apiRequest<{ message: string }>(buildApiUrl('/auth/change-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export function getMe(token: string) {
  return apiRequest<CurrentUser>(buildApiUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })
}

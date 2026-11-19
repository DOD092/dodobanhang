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

export function login(payload: LoginPayload) {
  return apiPost<{ accessToken: string }>('/auth/login', payload)
}

// `credential` = ID token Google Identity Services trả về (response.credential). Backend tự verify
// chữ ký + audience (GOOGLE_CLIENT_ID); chưa có tài khoản thì tạo customer mới (không cần mã email).
export function loginWithGoogle(credential: string) {
  return apiPost<GoogleAuthResult>('/auth/google', { credential })
}

export function getMe(token: string) {
  return apiRequest<CurrentUser>(buildApiUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })
}

import { apiPost, apiRequest, buildApiUrl } from '@/apis/client'
import type { CurrentUser, LoginPayload, RegisterPayload } from '@/types/Auth'

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

export function getMe(token: string) {
  return apiRequest<CurrentUser>(buildApiUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })
}

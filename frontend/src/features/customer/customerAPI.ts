import { apiRequest, buildApiUrl } from '@/apis/client'
import type { CustomerProfile, UpdateProfilePayload } from '@/types/Customer'

/*
  Hồ sơ của khách hàng đang đăng nhập (chỉ role CUSTOMER; role khác -> 403).
  Gọi từ Client Component, token lấy từ useAuth().token.
*/
const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

export function getMyProfile(token: string) {
  return apiRequest<CustomerProfile>(buildApiUrl('/customers/me/profile'), {
    headers: authHeader(token),
  })
}

export function updateMyProfile(token: string, payload: UpdateProfilePayload) {
  return apiRequest<CustomerProfile>(buildApiUrl('/customers/me/profile'), {
    method: 'PATCH',
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

// multipart/form-data, field "avatar". Không tự đặt Content-Type: trình duyệt tự thêm boundary.
// Backend: chỉ jpg/png/webp, tối đa 2MB.
export function updateMyAvatar(token: string, file: File) {
  const form = new FormData()
  form.append('avatar', file)
  return apiRequest<{ avatarUrl: string }>(buildApiUrl('/customers/me/avatar'), {
    method: 'PATCH',
    headers: authHeader(token),
    body: form,
  })
}

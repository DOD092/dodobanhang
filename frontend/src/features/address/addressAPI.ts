import { apiRequest, buildApiUrl } from '@/apis/client'
import type { Address, CreateAddressPayload } from '@/types/Address'

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

// Địa chỉ mặc định đứng đầu
export function getMyAddresses(token: string) {
  return apiRequest<Address[]>(buildApiUrl('/addresses/me'), { headers: auth(token) })
}

export function createMyAddress(token: string, payload: CreateAddressPayload) {
  return apiRequest<Address>(buildApiUrl('/addresses/me'), {
    method: 'POST',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

import { apiRequest, buildApiUrl } from '@/apis/client'
import type { CheckoutPayload, CheckoutResult, OrderDetail, OrderSummary } from '@/types/Order'

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

// Đặt hàng từ giỏ hiện tại. Giá, tổng tiền tính ở backend; giỏ chuyển CHECKED_OUT.
export function checkout(token: string, payload: CheckoutPayload) {
  return apiRequest<CheckoutResult>(buildApiUrl('/orders/me/checkout'), {
    method: 'POST',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getMyOrders(token: string) {
  return apiRequest<OrderSummary[]>(buildApiUrl('/orders/me'), { headers: auth(token) })
}

// Huỷ đơn chưa xác nhận / chưa thanh toán; backend trả hàng về giỏ và trả lại chi tiết đơn
export function cancelMyOrder(token: string, orderCode: string) {
  return apiRequest<OrderDetail>(
    buildApiUrl(`/orders/me/${encodeURIComponent(orderCode)}/cancel`),
    { method: 'POST', headers: auth(token) }
  )
}

// Đơn payOS đang chờ: backend tự đối soát với payOS mỗi lần gọi hàm này
export function getMyOrder(token: string, orderCode: string) {
  return apiRequest<OrderDetail>(buildApiUrl(`/orders/me/${encodeURIComponent(orderCode)}`), {
    headers: auth(token),
  })
}

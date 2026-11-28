import type { OrderStatus, OrderSummary } from '@/types/Order'

// File thường (không 'use client') để cả Server lẫn Client Component dùng chung
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  PACKED: 'Đã đóng gói',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Đã trả hàng',
}

// Màu nhãn trạng thái (class Tailwind viết nguyên chuỗi để Tailwind quét thấy)
export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-brand-primary-light text-brand-primary',
  PROCESSING: 'bg-brand-primary-light text-brand-primary',
  PACKED: 'bg-brand-primary-light text-brand-primary',
  SHIPPING: 'bg-sky-50 text-sky-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-neutral-100 text-neutral-500',
  RETURNED: 'bg-neutral-100 text-neutral-500',
}

export function paymentLabel(order: Pick<OrderSummary, 'paymentMethod' | 'paymentStatus'>) {
  if (order.paymentStatus === 'SUCCESS') return 'Đã thanh toán'
  if (order.paymentStatus === 'REFUNDED') return 'Đã hoàn tiền'
  if (order.paymentMethod === 'COD') return 'Thanh toán khi nhận hàng'
  return order.paymentStatus === 'PENDING' ? 'Chờ chuyển khoản' : 'Chưa thanh toán'
}

export function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

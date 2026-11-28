import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import OrderResult from '@/components/checkout/OrderResult'

export const metadata: Metadata = { title: 'Chi tiết đơn hàng' }

// Xem lại 1 đơn đã đặt (từ "Đơn hàng của tôi" ở /account)
export default async function MyOrderDetailPage({
  params,
}: {
  params: Promise<{ orderCode: string }>
}) {
  const { orderCode } = await params
  if (!/^\d{1,20}$/.test(orderCode)) notFound()
  return <OrderResult orderCode={orderCode} variant="detail" />
}

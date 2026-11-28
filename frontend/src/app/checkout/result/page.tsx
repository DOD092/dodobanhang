import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import OrderResult from '@/components/checkout/OrderResult'

export const metadata: Metadata = { title: 'Kết quả đặt hàng' }

// payOS / trang thanh toán chuyển về đây: /checkout/result?orderCode=...
export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderCode?: string | string[] }>
}) {
  const { orderCode } = await searchParams
  if (typeof orderCode !== 'string' || !/^\d{1,20}$/.test(orderCode)) notFound()
  return <OrderResult orderCode={orderCode} />
}

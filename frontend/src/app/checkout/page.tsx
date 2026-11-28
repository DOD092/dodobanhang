import type { Metadata } from 'next'

import CheckoutView from '@/components/checkout/CheckoutView'

export const metadata: Metadata = { title: 'Thanh toán' }

// Cần token trong localStorage nên toàn bộ nội dung là Client Component
export default function CheckoutPage() {
  return <CheckoutView />
}

// Khớp DTO /api/orders/me của backend (my-order-service.interface.ts)
export type CheckoutPaymentMethod = 'COD' | 'PAYOS'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'

export interface CheckoutPayload {
  addressId: string
  customerNote?: string
  paymentMethod: CheckoutPaymentMethod
}

export interface CheckoutResult {
  orderCode: string
  totalAmount: number
  paymentMethod: CheckoutPaymentMethod
  checkoutUrl: string | null // link trang thanh toán payOS; COD -> null
}

export interface OrderSummary {
  orderCode: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: CheckoutPaymentMethod
  totalAmount: number
  itemCount: number
  createdAt: string
}

export interface OrderDetail extends OrderSummary {
  subtotal: number
  shippingFee: number
  discountAmount: number
  customerNote: string | null
  orderAddress: string
  paymentExpiredAt: string | null // hạn chuyển khoản payOS khi còn chờ; đã trả / COD -> null
  items: {
    productName: string
    variantName: string
    sku: string
    unitPrice: number
    quantity: number
  }[]
}

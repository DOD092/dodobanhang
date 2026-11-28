'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { getMyOrders } from '@/features/order/orderAPI'
import {
  formatOrderDate,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
  paymentLabel,
} from '@/features/order/orderLabels'
import type { OrderSummary } from '@/types/Order'
import { formatPrice } from '@/utils/formatPrice'

const INITIAL_SHOWN = 5 // backend trả tối đa 50 đơn gần nhất

// "Đơn hàng của tôi" ở /account (GET /api/orders/me). Bấm 1 đơn -> /account/orders/<mã đơn>
export default function MyOrdersSection() {
  const router = useRouter()
  const { token, logout } = useAuth()
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getMyOrders(token)
      .then((data) => !cancelled && setOrders(data))
      .catch((e) => {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 401) {
          logout()
          router.replace('/login')
          return
        }
        setError(e instanceof ApiError ? e.message : 'Không tải được đơn hàng')
      })
    return () => {
      cancelled = true
    }
  }, [token, logout, router])

  if (error) return <p className="mb-0 text-sm text-red-600">{error}</p>
  if (!orders) return <p className="mb-0 text-sm text-neutral-500">Đang tải đơn hàng...</p>

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-neutral-600">Bạn chưa có đơn hàng nào.</p>
        <Link href="/products" className="btn btn-primary rounded-lg px-5 py-2">
          Mua sắm ngay
        </Link>
      </div>
    )
  }

  const shown = showAll ? orders : orders.slice(0, INITIAL_SHOWN)

  return (
    <>
      <ul className="m-0 list-none space-y-3 p-0">
        {shown.map((order) => (
          <li key={order.orderCode}>
            <Link
              href={`/account/orders/${order.orderCode}`}
              className="block rounded-xl border border-neutral-200 p-4 text-neutral-900 no-underline transition-colors hover:border-brand-primary hover:bg-neutral-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">#{order.orderCode}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_CLASS[order.status]}`}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="mt-1 mb-0 text-xs text-neutral-500">
                {formatOrderDate(order.createdAt)} · {order.itemCount} sản phẩm ·{' '}
                {paymentLabel(order)}
              </p>
              <p className="mt-2 mb-0 flex items-baseline justify-between text-sm">
                <span className="text-neutral-600">Tổng tiền</span>
                <span className="font-bold text-red-600">{formatPrice(order.totalAmount)}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {orders.length > INITIAL_SHOWN && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-3 text-sm font-medium text-brand-primary hover:underline"
        >
          {showAll ? 'Thu gọn' : `Xem tất cả ${orders.length} đơn`}
        </button>
      )}
    </>
  )
}

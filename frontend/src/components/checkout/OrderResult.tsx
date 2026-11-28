'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCart } from '@/features/cart/CartProvider'
import { cancelMyOrder, getMyOrder } from '@/features/order/orderAPI'
import {
  formatOrderDate,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
  paymentLabel,
} from '@/features/order/orderLabels'
import type { OrderDetail } from '@/types/Order'
import { formatPrice } from '@/utils/formatPrice'

const POLL_MS = 3000
const MAX_POLLS = 40 // ~2 phút; quá thì để khách bấm "Kiểm tra lại"

interface Props {
  orderCode: string
  // 'result': ngay sau khi đặt / payOS chuyển về (/checkout/result)
  // 'detail': xem lại đơn cũ (/account/orders/<mã>)
  variant?: 'result' | 'detail'
}

const isAwaitingTransfer = (o: OrderDetail) =>
  o.paymentMethod === 'PAYOS' && o.status === 'PENDING' && o.paymentStatus === 'PENDING'

/*
  Thông tin 1 đơn. Trạng thái luôn hỏi lại backend (GET /api/orders/me/:orderCode), không tin
  tham số trên URL. Đơn payOS đang chờ chuyển khoản: backend đối soát với payOS mỗi lần gọi, trang
  này hỏi lại mỗi 3 giây cho tới khi có kết quả (đã trả / huỷ / hết hạn).
  Huỷ đơn (chỉ khi PENDING, chưa trả tiền): hàng được trả về giỏ -> refreshCart().
*/
export default function OrderResult({ orderCode, variant = 'result' }: Props) {
  const router = useRouter()
  const { token, loading, logout } = useAuth()
  const { refreshCart } = useCart()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [polls, setPolls] = useState(0)

  const selfPath =
    variant === 'detail'
      ? `/account/orders/${orderCode}`
      : `/checkout/result?orderCode=${orderCode}`

  const handleError = useCallback(
    (e: unknown, setMessage: (message: string) => void) => {
      if (e instanceof ApiError && e.status === 401) {
        logout()
        router.replace('/login')
        return
      }
      setMessage(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
    },
    [logout, router]
  )

  const load = useCallback(async () => {
    if (!token) return
    try {
      const data = await getMyOrder(token, orderCode)
      setOrder((previous) => {
        // Đơn payOS bị huỷ / hết hạn (kể cả lần tải đầu, khi payOS chuyển về với ?cancel=1) ->
        // backend đã trả hàng về giỏ: cập nhật số trên header
        if (data.status === 'CANCELLED' && previous?.status !== 'CANCELLED') {
          refreshCart()
        }
        return data
      })
    } catch (e) {
      handleError(e, setError)
    }
  }, [token, orderCode, refreshCart, handleError])

  useEffect(() => {
    if (loading) return
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(selfPath)}`)
      return
    }
    load()
  }, [loading, token, selfPath, router, load])

  // Đang chờ chuyển khoản: hỏi lại định kỳ
  const awaiting = order ? isAwaitingTransfer(order) : false
  useEffect(() => {
    if (!awaiting || polls >= MAX_POLLS) return
    const timer = setTimeout(() => {
      setPolls((n) => n + 1)
      load()
    }, POLL_MS)
    return () => clearTimeout(timer)
  }, [awaiting, polls, load])

  const cancelOrder = async () => {
    if (!token || !order || cancelling) return
    if (!window.confirm(`Huỷ đơn #${order.orderCode}? Sản phẩm sẽ được trả về giỏ hàng.`)) return
    setCancelling(true)
    setActionError(null)
    try {
      setOrder(await cancelMyOrder(token, order.orderCode))
      refreshCart()
    } catch (e) {
      handleError(e, setActionError)
      load() // vd vừa thanh toán xong -> backend báo 409, tải lại để hiện đúng trạng thái
    } finally {
      setCancelling(false)
    }
  }

  if (error) {
    return (
      <section className="container max-w-md py-16 text-center">
        <p className="mb-6 text-neutral-600">{error}</p>
        <Link href="/account#orders" className="btn btn-primary rounded-lg px-6 py-2.5">
          Đơn hàng của tôi
        </Link>
      </section>
    )
  }

  if (!order) return <p className="container py-12">Đang tải đơn hàng...</p>

  const cancelled = order.status === 'CANCELLED'
  const paid = order.paymentStatus === 'SUCCESS'
  const isResult = variant === 'result'
  const canCancel = order.status === 'PENDING' && !paid

  // Tiêu đề khung trên cùng của trang kết quả
  const hero = cancelled
    ? {
        icon: '✕',
        tone: 'bg-red-50 text-red-600',
        title: 'Đơn hàng đã huỷ',
        text: paid
          ? 'Đơn đã huỷ nhưng cửa hàng đã nhận tiền, chúng tôi sẽ liên hệ để hoàn tiền.'
          : 'Sản phẩm đã được trả về giỏ hàng, bạn có thể đặt lại bất cứ lúc nào.',
      }
    : awaiting
      ? {
          icon: '⏳',
          tone: 'bg-amber-50 text-amber-600',
          title: 'Đang chờ thanh toán',
          text: order.paymentExpiredAt
            ? `Vui lòng hoàn tất chuyển khoản trước ${formatOrderDate(order.paymentExpiredAt)}. Trang sẽ tự cập nhật khi nhận được tiền.`
            : 'Trang sẽ tự cập nhật khi nhận được tiền.',
        }
      : {
          icon: '✓',
          tone: 'bg-brand-primary-light text-brand-primary',
          title: paid ? 'Thanh toán thành công' : 'Đặt hàng thành công',
          text:
            order.paymentMethod === 'COD'
              ? `Bạn sẽ thanh toán ${formatPrice(order.totalAmount)} khi nhận hàng.`
              : 'Cửa hàng đã nhận được tiền và sẽ sớm giao hàng cho bạn.',
        }

  return (
    <div className="bg-neutral-100 py-8 md:py-12">
      <div className="container max-w-2xl space-y-4">
        {!isResult && (
          <Link href="/account#orders" className="inline-block text-sm text-brand-primary">
            ← Đơn hàng của tôi
          </Link>
        )}

        {isResult ? (
          <section className="rounded-xl bg-white p-6 text-center" aria-live="polite">
            <span
              aria-hidden="true"
              className={`mx-auto mb-3 flex size-14 items-center justify-center rounded-full text-2xl font-bold ${hero.tone}`}
            >
              {hero.icon}
            </span>
            <h1 className="mb-1 text-2xl font-bold">{hero.title}</h1>
            <p className="mb-0 text-neutral-600">
              Mã đơn <span className="font-semibold text-neutral-900">#{order.orderCode}</span> ·{' '}
              {ORDER_STATUS_LABEL[order.status]}
            </p>
            <p className="mt-2 mb-0 text-sm text-neutral-500">{hero.text}</p>
            {awaiting && polls >= MAX_POLLS && (
              <button
                type="button"
                onClick={() => setPolls(0)}
                className="mt-3 text-sm font-medium text-brand-primary hover:underline"
              >
                Kiểm tra lại
              </button>
            )}
          </section>
        ) : (
          <section className="rounded-xl bg-white p-6" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="mb-0 text-xl font-bold">Đơn hàng #{order.orderCode}</h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_CLASS[order.status]}`}
              >
                {ORDER_STATUS_LABEL[order.status]}
              </span>
            </div>
            <p className="mt-1 mb-0 text-sm text-neutral-500">
              Đặt lúc {formatOrderDate(order.createdAt)} · {paymentLabel(order)}
            </p>
            {awaiting && <p className="mt-2 mb-0 text-sm text-amber-700">{hero.text}</p>}
          </section>
        )}

        <section className="rounded-xl bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold">Thông tin đơn hàng</h2>
          <p className="mb-1 text-sm text-neutral-600">Giao tới</p>
          <p className="mb-4 text-sm">{order.orderAddress}</p>
          {order.customerNote && (
            <>
              <p className="mb-1 text-sm text-neutral-600">Ghi chú</p>
              <p className="mb-4 text-sm whitespace-pre-line">{order.customerNote}</p>
            </>
          )}
          <ul className="m-0 list-none divide-y divide-neutral-100 p-0">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="line-clamp-2">{item.productName}</span>
                  <span className="text-neutral-500">
                    {formatPrice(item.unitPrice)} x {item.quantity}
                  </span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="m-0 mt-3 space-y-1 border-t border-neutral-200 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-600">Tạm tính</dt>
              <dd className="mb-0">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-600">Phí vận chuyển</dt>
              <dd className="mb-0">
                {order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}
              </dd>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <dt className="text-neutral-600">Giảm giá</dt>
                <dd className="mb-0">-{formatPrice(order.discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-neutral-600">Thanh toán</dt>
              <dd className="mb-0">{paymentLabel(order)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-semibold">Tổng cộng</dt>
              <dd className="mb-0 text-xl font-bold text-red-600">
                {formatPrice(order.totalAmount)}
              </dd>
            </div>
          </dl>
        </section>

        {actionError && (
          <p role="alert" className="mb-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {actionError}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {canCancel && (
            <button
              type="button"
              onClick={cancelOrder}
              disabled={cancelling}
              className="btn btn-outline-secondary rounded-lg px-6 py-2.5 disabled:opacity-60"
            >
              {cancelling ? 'Đang huỷ...' : 'Huỷ đơn'}
            </button>
          )}
          {cancelled && !paid ? (
            <Link href="/cart" className="btn btn-primary rounded-lg px-6 py-2.5">
              Về giỏ hàng
            </Link>
          ) : (
            <>
              {isResult && (
                <Link
                  href="/account#orders"
                  className="btn btn-outline-primary rounded-lg px-6 py-2.5"
                >
                  Xem đơn hàng của tôi
                </Link>
              )}
              <Link href="/products" className="btn btn-primary rounded-lg px-6 py-2.5">
                Tiếp tục mua sắm
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

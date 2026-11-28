'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { getMyAddresses } from '@/features/address/addressAPI'
import { useCart } from '@/features/cart/CartProvider'
import { checkout } from '@/features/order/orderAPI'
import type { Address } from '@/types/Address'
import type { CheckoutPaymentMethod } from '@/types/Order'
import { formatPrice } from '@/utils/formatPrice'

import AddressForm from './AddressForm'

const NOTE_MAX = 500

const PAYMENT_OPTIONS: {
  value: CheckoutPaymentMethod
  label: string
  hint: string
  disabled?: boolean
}[] = [
  {
    value: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    hint: 'Trả tiền mặt cho người giao hàng',
  },
  {
    value: 'PAYOS',
    label: 'Chuyển khoản QR (payOS)',
    hint: 'Quét mã VietQR bằng app ngân hàng, xác nhận tự động',
  },
]

const formatAddress = (a: Address) =>
  [a.addressLine, a.ward, a.district, a.province].filter(Boolean).join(', ')

/*
  Trang thanh toán: chọn / thêm địa chỉ -> ghi chú -> cách thanh toán -> "Đặt hàng".
  Giá và tổng tiền hiển thị lấy từ giỏ (CartProvider); số tiền thật do backend tính lại lúc đặt.
  Đặt xong: COD -> /checkout/result; payOS -> chuyển sang trang thanh toán của payOS (checkoutUrl).
*/
export default function CheckoutView() {
  const router = useRouter()
  const { user, token, loading, logout } = useAuth()
  const { cart, refreshCart } = useCart()

  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [addressId, setAddressId] = useState<string | null>(null)
  const [addingAddress, setAddingAddress] = useState(false)
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('COD')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.replace(`/login?next=${encodeURIComponent('/checkout')}`)
  }, [logout, router])

  // Tải địa chỉ khi đã có token; chọn sẵn địa chỉ mặc định (backend trả mặc định đứng đầu)
  useEffect(() => {
    if (!token || user?.role !== 'CUSTOMER') return
    let cancelled = false
    getMyAddresses(token)
      .then((list) => {
        if (cancelled) return
        setAddresses(list)
        setAddressId(list[0]?.id ?? null)
      })
      .catch((e) => {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 401) return handleUnauthorized()
        setAddresses([])
        setError(e instanceof ApiError ? e.message : 'Không tải được địa chỉ')
      })
    return () => {
      cancelled = true
    }
  }, [token, user?.role, handleUnauthorized])

  useEffect(() => {
    if (user) refreshCart()
  }, [user, refreshCart])

  if (loading) return <p className="container py-12">Đang tải...</p>

  if (!user) {
    return (
      <section className="container max-w-md py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">Thanh toán</h1>
        <p className="mb-6 text-neutral-600">Vui lòng đăng nhập để đặt hàng.</p>
        <Link
          href={`/login?next=${encodeURIComponent('/checkout')}`}
          className="btn btn-primary rounded-lg px-6 py-2.5"
        >
          Đăng nhập
        </Link>
      </section>
    )
  }

  if (user.role !== 'CUSTOMER') {
    return (
      <p className="container py-12 text-neutral-600">
        Chỉ tài khoản khách hàng mới đặt hàng được.
      </p>
    )
  }

  if (!cart) return <p className="container py-12">Đang tải giỏ hàng...</p>

  if (cart.items.length === 0) {
    return (
      <section className="container max-w-md py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">Thanh toán</h1>
        <p className="mb-6 text-neutral-600">Giỏ hàng của bạn đang trống.</p>
        <Link href="/products" className="btn btn-primary rounded-lg px-6 py-2.5">
          Tiếp tục mua sắm
        </Link>
      </section>
    )
  }

  const showAddressForm = addresses !== null && (addresses.length === 0 || addingAddress)
  const canSubmit = !!addressId && !submitting && !showAddressForm

  const placeOrder = async () => {
    if (!token || !addressId || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await checkout(token, {
        addressId,
        paymentMethod,
        customerNote: note.trim() || undefined,
      })
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl // rời site, quay lại thì giỏ tự tải lại
        return
      }
      // Chuyển trang TRƯỚC rồi mới tải lại giỏ (đã chốt -> số trên header về 0), nếu không trang này
      // kịp vẽ lại thành "Giỏ hàng trống" trong tích tắc
      router.push(`/checkout/result?orderCode=${result.orderCode}`)
      refreshCart()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return handleUnauthorized()
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
      setSubmitting(false)
    }
  }

  const box = 'rounded-xl bg-white p-4 md:p-6'

  return (
    <div className="bg-neutral-100 py-8 md:py-12">
      <div className="container">
        <h1 className="mb-4 text-2xl font-bold">Thanh toán</h1>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {/* 1. Địa chỉ */}
            <section className={box} aria-labelledby="checkout-address">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="checkout-address" className="mb-0 text-lg font-semibold">
                  Địa chỉ nhận hàng
                </h2>
                {addresses && addresses.length > 0 && !addingAddress && (
                  <button
                    type="button"
                    onClick={() => setAddingAddress(true)}
                    className="text-sm font-medium text-brand-primary hover:underline"
                  >
                    + Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {addresses === null ? (
                <p className="mb-0 text-sm text-neutral-500">Đang tải địa chỉ...</p>
              ) : showAddressForm ? (
                <AddressForm
                  token={token!}
                  isFirst={addresses.length === 0}
                  onCreated={(created) => {
                    // Địa chỉ mới đặt mặc định -> các địa chỉ khác bỏ mặc định (giống backend)
                    setAddresses((list) => [
                      created,
                      ...(list ?? []).map((a) =>
                        created.isDefault ? { ...a, isDefault: false } : a
                      ),
                    ])
                    setAddressId(created.id)
                    setAddingAddress(false)
                  }}
                  onCancel={addresses.length > 0 ? () => setAddingAddress(false) : undefined}
                  onUnauthorized={handleUnauthorized}
                />
              ) : (
                <ul className="m-0 list-none space-y-2 p-0">
                  {addresses.map((a) => (
                    <li key={a.id}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-lg border-2 p-3 transition-colors ${
                          addressId === a.id
                            ? 'border-brand-primary bg-brand-primary-light'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={a.id}
                          checked={addressId === a.id}
                          onChange={() => setAddressId(a.id)}
                          className="mt-1 size-4 accent-brand-primary"
                        />
                        <span className="min-w-0 text-sm">
                          <span className="font-semibold">{a.receiverName}</span>
                          <span className="text-neutral-500"> | {a.receiverPhone}</span>
                          {a.isDefault && (
                            <span className="ms-2 rounded border border-brand-coral px-1.5 text-xs text-brand-coral">
                              Mặc định
                            </span>
                          )}
                          <span className="block text-neutral-600">{formatAddress(a)}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 2. Ghi chú */}
            <section className={box}>
              <label htmlFor="checkout-note" className="mb-2 block text-lg font-semibold">
                Ghi chú cho người bán <span className="text-sm font-normal">(không bắt buộc)</span>
              </label>
              <textarea
                id="checkout-note"
                rows={3}
                maxLength={NOTE_MAX}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                className="form-input"
              />
              <p className="mt-1 mb-0 text-right text-xs text-neutral-400">
                {note.length}/{NOTE_MAX}
              </p>
            </section>

            {/* 3. Cách thanh toán */}
            <section className={box}>
              <h2 className="mb-3 text-lg font-semibold">Phương thức thanh toán</h2>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex gap-3 rounded-lg border-2 p-3 ${
                      opt.disabled
                        ? 'cursor-not-allowed border-neutral-200 opacity-60'
                        : paymentMethod === opt.value
                          ? 'cursor-pointer border-brand-primary bg-brand-primary-light'
                          : 'cursor-pointer border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      disabled={opt.disabled}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="mt-1 size-4 accent-brand-primary"
                    />
                    <span className="text-sm">
                      <span className="block font-medium">{opt.label}</span>
                      <span className="text-neutral-500">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Tóm tắt đơn */}
          <aside className={`${box} space-y-4 lg:sticky lg:top-24`}>
            <h2 className="mb-0 text-lg font-semibold">Đơn hàng ({cart.totalQuantity} sản phẩm)</h2>
            <ul className="m-0 max-h-72 list-none space-y-3 overflow-y-auto p-0">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
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
            <dl className="m-0 space-y-1 border-t border-neutral-200 pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600">Tạm tính</dt>
                <dd className="mb-0">{formatPrice(cart.totalAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Phí vận chuyển</dt>
                <dd className="mb-0">Miễn phí</dd>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-semibold">Tổng cộng</dt>
                <dd className="mb-0 text-2xl font-bold text-red-600">
                  {formatPrice(cart.totalAmount)}
                </dd>
              </div>
            </dl>

            {error && (
              <p role="alert" className="mb-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={placeOrder}
              disabled={!canSubmit}
              className="btn w-full rounded-lg bg-red-600 py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
            </button>
            {!addressId && addresses !== null && (
              <p className="mb-0 text-center text-xs text-neutral-500">
                Thêm địa chỉ nhận hàng để đặt hàng.
              </p>
            )}
            <Link href="/cart" className="block text-center text-sm text-brand-primary">
              ← Quay lại giỏ hàng
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

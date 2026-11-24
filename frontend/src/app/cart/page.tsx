'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import CartItemRow from '@/components/cart/CartItemRow'
import { CartIcon } from '@/components/common/Icons'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCart } from '@/features/cart/CartProvider'
import { formatPrice } from '@/utils/formatPrice'

/*
  Trang giỏ hàng (nút giỏ ở header). Dữ liệu: GET /api/cart/me qua CartProvider.
  Chưa đăng nhập -> yêu cầu đăng nhập (quay lại /cart sau khi đăng nhập).
  Mỗi dòng (CartItemRow): tăng/giảm/nhập số lượng, xóa. Chưa có API đặt hàng -> nút "Thanh toán"
  báo đang hoàn thiện.
*/
export default function CartPage() {
  const { user, loading } = useAuth()
  const { cart, refreshCart } = useCart()

  // Vào trang thì tải lại cho chắc (giỏ có thể đổi ở tab khác)
  useEffect(() => {
    if (user) refreshCart()
  }, [user, refreshCart])

  if (loading) return <p className="container py-12">Đang tải...</p>

  if (!user) {
    return (
      <section className="container max-w-md py-16 text-center">
        <CartIcon className="mx-auto mb-4 size-12 text-brand-primary" />
        <h1 className="mb-2 text-2xl font-bold">Giỏ hàng</h1>
        <p className="mb-6 text-neutral-600">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
        <div className="flex justify-center gap-3">
          <Link
            href={`/login?next=${encodeURIComponent('/cart')}&reason=cart-view`}
            className="btn btn-primary rounded-lg px-6 py-2.5"
          >
            Đăng nhập
          </Link>
          <Link
            href={`/register?next=${encodeURIComponent('/cart')}`}
            className="btn btn-outline-primary rounded-lg px-6 py-2.5"
          >
            Đăng ký
          </Link>
        </div>
      </section>
    )
  }

  const items = cart?.items ?? []

  return (
    <div className="bg-neutral-100 py-8 md:py-12">
      <div className="container">
        <h1 className="mb-4 text-2xl font-bold">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white px-6 py-16 text-center">
            <CartIcon className="mx-auto mb-4 size-12 text-neutral-300" />
            <p className="mb-6 text-neutral-600">Giỏ hàng của bạn đang trống.</p>
            <Link href="/products" className="btn btn-primary rounded-lg px-6 py-2.5">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ul className="m-0 list-none divide-y divide-neutral-200 rounded-xl bg-white p-0">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </ul>

            <aside className="space-y-3 rounded-xl bg-white p-4 lg:sticky lg:top-24">
              <p className="mb-0 flex justify-between text-sm text-neutral-600">
                <span>Tạm tính ({cart?.totalQuantity} sản phẩm)</span>
              </p>
              <p className="mb-0 text-2xl font-bold text-red-600">
                {formatPrice(cart?.totalAmount ?? 0)}
              </p>
              <button
                type="button"
                disabled
                className="btn w-full rounded-lg bg-red-600 py-3 text-white"
                title="Đang hoàn thiện"
              >
                Thanh toán
              </button>
              <p className="mb-0 text-xs text-neutral-500">
                Thanh toán online đang được hoàn thiện.{' '}
                <Link href="/contact" className="text-brand-primary">
                  Liên hệ để đặt mua
                </Link>
                .
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

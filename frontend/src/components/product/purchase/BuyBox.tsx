'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { addToCart } from '@/features/cart/cartAPI'
import { useCart } from '@/features/cart/CartProvider'
import { formatPrice } from '@/utils/formatPrice'

import { MAX_QUANTITY, usePurchase } from './PurchaseContext'

/*
  Khung mua hàng bên phải (dính khi cuộn): số lượng, tạm tính, "Mua ngay" / "Thêm vào giỏ".
  - Thêm vào giỏ: POST /api/cart/me/items { variantId, quantity } (Bearer token). BẮT BUỘC đăng nhập:
    chưa đăng nhập thì KHÔNG gọi API, hiện yêu cầu đăng nhập + nút sang /login?next=<trang này>.
  - 401 (token hết hạn) -> đăng xuất, hiện yêu cầu đăng nhập lại.
  - Mua ngay: thêm vào giỏ như trên; trang giỏ hàng / thanh toán chưa có nên chỉ báo đã thêm.
*/
type Status =
  | { kind: 'success'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'login'; text: string }

export default function BuyBox() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, loading, logout } = useAuth()
  const { selected, quantity, setQuantity } = usePurchase()
  const { setCart } = useCart()
  const [status, setStatus] = useState<Status | null>(null)
  const [adding, setAdding] = useState(false)
  const price = selected?.price ?? null

  // Đăng nhập xong quay lại đúng trang sản phẩm này (trang /login đọc ?next=)
  const loginHref = `/login?next=${encodeURIComponent(pathname)}&reason=cart`

  const handleAdd = async (buyNow: boolean) => {
    if (loading || adding || !selected) return
    if (!user || !token) {
      setStatus({ kind: 'login', text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.' })
      return
    }

    setAdding(true)
    setStatus(null)
    try {
      const cart = await addToCart(token, selected.id, quantity)
      setCart(cart) // số trên nút giỏ ở header cập nhật ngay
      setStatus({
        kind: 'success',
        text: buyNow
          ? `Đã thêm vào giỏ (${cart.totalQuantity} sản phẩm). Trang thanh toán đang được hoàn thiện.`
          : `Đã thêm vào giỏ hàng. Giỏ hàng có ${cart.totalQuantity} sản phẩm.`,
      })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout()
        setStatus({ kind: 'login', text: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.' })
        return
      }
      if (e instanceof ApiError && e.status === 403) {
        setStatus({ kind: 'error', text: 'Chỉ tài khoản khách hàng mới dùng được giỏ hàng.' })
        return
      }
      setStatus({
        kind: 'error',
        text: e instanceof ApiError ? e.message : 'Không kết nối được máy chủ',
      })
    } finally {
      setAdding(false)
    }
  }

  if (price === null) {
    return (
      <div className="space-y-3">
        <p className="mb-0 text-sm text-neutral-600">Sản phẩm chưa niêm yết giá.</p>
        <Link href="/contact" className="btn btn-primary w-full rounded-lg py-3">
          Liên hệ nhận báo giá
        </Link>
      </div>
    )
  }

  const stepper =
    'flex size-9 items-center justify-center border border-neutral-300 text-lg text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300'

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold">Số lượng</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Giảm số lượng"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className={`${stepper} rounded-l-lg`}
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QUANTITY}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            aria-label="Số lượng"
            className="h-9 w-14 border border-neutral-300 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= MAX_QUANTITY}
            className={`${stepper} rounded-r-lg`}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold">Tạm tính</p>
        <p className="mb-0 text-2xl font-bold">{formatPrice(price * quantity)}</p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleAdd(true)}
          disabled={adding || loading}
          className="btn w-full rounded-lg bg-red-600 py-3 text-white hover:bg-red-700"
        >
          Mua ngay
        </button>
        <button
          type="button"
          onClick={() => handleAdd(false)}
          disabled={adding || loading}
          className="btn btn-outline-primary w-full rounded-lg py-3"
        >
          {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </button>
      </div>

      {status?.kind === 'login' && (
        <div
          role="alert"
          className="space-y-2 rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-900"
        >
          <p className="mb-0">{status.text}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(loginHref)}
              className="btn btn-primary rounded-lg px-4 py-1.5 text-sm"
            >
              Đăng nhập
            </button>
            <Link
              href={`/register?next=${encodeURIComponent(pathname)}`}
              className="btn btn-outline-primary rounded-lg px-4 py-1.5 text-sm"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      )}
      {status && status.kind !== 'login' && (
        <p
          role={status.kind === 'success' ? 'status' : 'alert'}
          className={`mb-0 rounded-lg px-3 py-2 text-sm ${
            status.kind === 'success'
              ? 'bg-brand-primary-light text-brand-primary'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  )
}

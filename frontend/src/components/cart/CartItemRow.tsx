'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { type MyCart, removeCartItem, updateCartItem } from '@/features/cart/cartAPI'
import { useCart } from '@/features/cart/CartProvider'
import { formatPrice } from '@/utils/formatPrice'
import { productPath } from '@/utils/slug'

const MAX_QUANTITY = 99 // = MAX_CART_QUANTITY của backend

type CartItem = MyCart['items'][number]

/*
  1 dòng trong giỏ: − / ô số / + (PATCH /api/cart/me/items/:id), nút "Xóa" (DELETE).
  Mỗi lần đổi gọi API rồi setCart(response) -> tổng tiền + số trên header cập nhật theo backend.
  Ô số: gõ xong thì lưu khi rời ô hoặc Enter. Đang lưu thì khoá dòng để không gửi trùng.
  401 -> đăng xuất (trang /cart tự chuyển sang yêu cầu đăng nhập).
*/
export default function CartItemRow({ item }: { item: CartItem }) {
  const { token, logout } = useAuth()
  const { setCart } = useCart()
  const [draft, setDraft] = useState(String(item.quantity))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Đồng bộ ô số khi số lượng đổi từ backend (vd thêm cùng sản phẩm ở tab khác)
  useEffect(() => setDraft(String(item.quantity)), [item.quantity])

  const run = async (action: () => Promise<MyCart>) => {
    if (!token || busy) return
    setBusy(true)
    setError(null)
    try {
      setCart(await action())
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout()
        return
      }
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
      setDraft(String(item.quantity))
    } finally {
      setBusy(false)
    }
  }

  const changeQuantity = (next: number) => {
    const quantity = Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(next) || 1))
    setDraft(String(quantity))
    if (quantity !== item.quantity) run(() => updateCartItem(token!, item.id, quantity))
  }

  const remove = () => {
    if (window.confirm(`Xóa "${item.productName}" khỏi giỏ hàng?`)) {
      run(() => removeCartItem(token!, item.id))
    }
  }

  const option =
    item.variantName !== item.productName
      ? item.variantName.replace(`${item.productName} - `, '')
      : null
  const stepper =
    'flex size-8 items-center justify-center border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300'

  return (
    <li className={`p-4 transition-opacity ${busy ? 'opacity-60' : ''}`} aria-busy={busy}>
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1 basis-60">
          <Link
            href={productPath({ slug: item.productSlug })}
            className="line-clamp-2 font-medium text-neutral-900 no-underline hover:text-brand-primary"
          >
            {item.productName}
          </Link>
          {option && <p className="mb-0 text-sm text-neutral-500">{option}</p>}
          <p className="mb-0 text-sm text-neutral-600">{formatPrice(item.unitPrice)}</p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            aria-label={`Giảm số lượng ${item.productName}`}
            onClick={() => changeQuantity(item.quantity - 1)}
            disabled={busy || item.quantity <= 1}
            className={`${stepper} rounded-l-lg`}
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QUANTITY}
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => changeQuantity(Number(draft))}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            aria-label={`Số lượng ${item.productName}`}
            className="h-8 w-12 border-y border-neutral-300 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label={`Tăng số lượng ${item.productName}`}
            onClick={() => changeQuantity(item.quantity + 1)}
            disabled={busy || item.quantity >= MAX_QUANTITY}
            className={`${stepper} rounded-r-lg`}
          >
            +
          </button>
        </div>

        <div className="w-28 text-right">
          <p className="mb-1 font-bold text-red-600">
            {formatPrice(item.unitPrice * item.quantity)}
          </p>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="text-sm text-neutral-500 hover:text-red-600 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 mb-0 text-sm text-red-600">
          {error}
        </p>
      )}
    </li>
  )
}

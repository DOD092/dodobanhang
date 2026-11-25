'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { CartIcon } from '@/components/common/Icons'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCart } from '@/features/cart/CartProvider'
import { formatPrice } from '@/utils/formatPrice'
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '@/utils/imageUrl'
import { productPath } from '@/utils/slug'

const PREVIEW_LIMIT = 5 // số sản phẩm hiện trong khung xem nhanh (mới thêm nhất trước)

/*
  Nút giỏ hàng ở header + khung xem nhanh kiểu sàn TMĐT: rê chuột (hoặc Tab tới nút) thì hiện các
  sản phẩm mới thêm, bấm nút vẫn sang /cart như cũ.
  - Chỉ hiện khung từ md: màn hình cảm ứng không có hover, chạm vào nút là sang thẳng /cart.
  - Khung cách nút bằng `pt-2` của chính lớp bọc (không dùng margin) để rê chuột từ nút xuống khung
    không đi qua khoảng trống và bị đóng giữa chừng.
  - Dùng state thay vì `group-hover`/`focus-within` thuần CSS: bấm link trong khung xong, focus còn
    nằm trên link (header không remount khi chuyển trang) nên khung sẽ kẹt mở. Đổi trang thì đóng.
*/
export default function CartMenu() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { cart, count } = useCart()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const items = cart ? [...cart.items].reverse() : []
  const shown = items.slice(0, PREVIEW_LIMIT)
  const hiddenCount = items.length - shown.length

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      {/* Số trên góc = tổng số lượng (CartProvider), > 99 hiện "99+" */}
      <Link
        href="/cart"
        aria-label={count > 0 ? `Giỏ hàng (${count} sản phẩm)` : 'Giỏ hàng'}
        className="relative flex size-10 items-center justify-center rounded-full text-brand-primary transition-colors hover:bg-brand-primary-light"
      >
        <CartIcon className="size-6" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-coral px-1 text-[11px] leading-none font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>

      <div
        className={`absolute top-full right-0 z-50 hidden w-96 max-w-[calc(100vw-2rem)] pt-2 transition-all duration-150 md:block ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {/* Mũi nhọn chỉ lên nút giỏ */}
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-3.5 size-3 rotate-45 border-t border-l border-neutral-200 bg-white"
        />
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-xl">
          {loading ? (
            <p className="mb-0 p-6 text-center text-sm text-neutral-500">Đang tải...</p>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-8 text-center">
              <span className="mb-3 flex size-20 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
                <CartIcon className="size-9" strokeWidth={1.5} />
              </span>
              <p className="mb-0 text-sm text-neutral-700">Chưa có sản phẩm</p>
              {!user && (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  className="btn btn-primary mt-4 rounded-full px-5 py-2 text-sm"
                >
                  Đăng nhập để xem giỏ hàng
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="mb-0 px-4 pt-3 pb-2 text-sm text-neutral-400">Sản phẩm mới thêm</p>
              <ul className="mb-0 max-h-80 list-none overflow-y-auto p-0">
                {shown.map((item) => {
                  const option =
                    item.variantName !== item.productName
                      ? item.variantName.replace(`${item.productName} - `, '')
                      : null
                  return (
                    <li key={item.id}>
                      <Link
                        href={productPath({ slug: item.productSlug })}
                        className="flex items-center gap-3 px-4 py-2 text-neutral-900 no-underline hover:bg-neutral-50"
                      >
                        <span className="relative size-11 shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-100">
                          <Image
                            src={item.image ? resolveImageUrl(item.image) : PLACEHOLDER_IMAGE}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{item.productName}</span>
                          {option && (
                            <span className="block truncate text-xs text-neutral-500">
                              {option}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-right text-sm">
                          <span className="block font-semibold text-red-600">
                            {formatPrice(item.unitPrice)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-xs text-neutral-500">x{item.quantity}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3">
                <span className="text-xs text-neutral-500">
                  {hiddenCount > 0 ? `${hiddenCount} sản phẩm khác trong giỏ` : ''}
                </span>
                <Link
                  href="/cart"
                  className="btn btn-primary rounded-full px-5 py-2 text-sm whitespace-nowrap"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

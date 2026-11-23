'use client'

import Link from 'next/link'
import { useState } from 'react'

import { formatPrice } from '@/utils/formatPrice'

import { MAX_QUANTITY, usePurchase } from './PurchaseContext'

/*
  Khung mua hàng bên phải (dính khi cuộn): số lượng, tạm tính, "Mua ngay" / "Thêm vào giỏ".
  Backend CHƯA có giỏ hàng / đặt hàng cho khách (API cart/order hiện là CRUD thô, chưa có
  phân quyền - xem backend.md mục 6) -> 2 nút chỉ báo đang phát triển và dẫn sang trang liên hệ.
*/
export default function BuyBox() {
  const { selected, quantity, setQuantity } = usePurchase()
  const [notice, setNotice] = useState(false)
  const price = selected?.price ?? null

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
          onClick={() => setNotice(true)}
          className="btn w-full rounded-lg bg-red-600 py-3 text-white hover:bg-red-700"
        >
          Mua ngay
        </button>
        <button
          type="button"
          onClick={() => setNotice(true)}
          className="btn btn-outline-primary w-full rounded-lg py-3"
        >
          Thêm vào giỏ
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="mb-0 rounded-lg bg-brand-primary-light px-3 py-2 text-sm text-brand-primary"
        >
          Đặt hàng online đang được hoàn thiện.{' '}
          <Link href="/contact" className="font-semibold underline">
            Liên hệ để đặt mua
          </Link>
          .
        </p>
      )}
    </div>
  )
}

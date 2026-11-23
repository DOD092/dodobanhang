'use client'

import { formatPrice } from '@/utils/formatPrice'

import { usePurchase } from './PurchaseContext'

// Nhãn lựa chọn: seeder lưu variant_name = "<tên sản phẩm> - <lựa chọn>" -> chỉ hiện phần lựa chọn
function optionLabel(variantName: string, productName: string) {
  const prefix = `${productName} - `
  return variantName.startsWith(prefix) ? variantName.slice(prefix.length) : variantName
}

/*
  Giá theo biến thể đang chọn (giá bán đỏ + % giảm + giá gốc gạch ngang) và các nút chọn biến thể
  (chỉ hiện khi có từ 2 biến thể). Giá null = "Liên hệ".
*/
export default function PriceAndVariants({ productName }: { productName: string }) {
  const { variants, selected, select } = usePurchase()
  const price = selected?.price ?? null
  const compare =
    price !== null && selected?.compareAtPrice && selected.compareAtPrice > price
      ? selected.compareAtPrice
      : null
  const discount = compare && price !== null ? Math.round((1 - price / compare) * 100) : 0

  return (
    <div className="space-y-4">
      {price !== null ? (
        <p className="mb-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-bold text-red-600">{formatPrice(price)}</span>
          {discount > 0 && (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm font-semibold text-neutral-700">
              -{discount}%
            </span>
          )}
          {compare !== null && (
            <span className="text-neutral-400 line-through">{formatPrice(compare)}</span>
          )}
        </p>
      ) : (
        <p className="mb-0 text-2xl font-bold text-brand-primary">Liên hệ để nhận báo giá</p>
      )}

      {variants.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-neutral-700">Phân loại</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const active = variant.id === selected?.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => select(variant.id)}
                  aria-pressed={active}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? 'border-brand-primary bg-brand-primary-light font-semibold text-brand-primary'
                      : 'border-neutral-300 text-neutral-800 hover:border-brand-primary'
                  }`}
                >
                  {optionLabel(variant.variantName, productName)}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}

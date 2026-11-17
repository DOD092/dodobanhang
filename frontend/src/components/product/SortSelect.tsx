'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import {
  buildProductsHref,
  sortOptions,
  type ProductQuery,
  type SortValue,
} from '@/features/product/productQuery'

interface SortSelectProps {
  query: ProductQuery
  // Không có sản phẩm nào niêm yết giá thì ẩn 2 lựa chọn sắp xếp theo giá (không có tác dụng gì)
  showPriceSort: boolean
}

export default function SortSelect({ query, showPriceSort }: SortSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const options = showPriceSort
    ? sortOptions
    : sortOptions.filter((option) => option.value !== 'price-asc' && option.value !== 'price-desc')

  return (
    <div className="flex items-center gap-x-2">
      {/* Màn hình hẹp: ẩn chữ để nút "Bộ lọc" và ô sắp xếp vừa 1 hàng (vẫn đọc được bằng screen reader) */}
      <label
        htmlFor="product-sort"
        className="sr-only text-sm whitespace-nowrap text-neutral-600 sm:not-sr-only"
      >
        Sắp xếp
      </label>
      <select
        id="product-sort"
        value={query.sort}
        disabled={isPending}
        onChange={(event) => {
          const sort = event.target.value as SortValue
          startTransition(() => {
            router.push(buildProductsHref(query, { sort }), { scroll: false })
          })
        }}
        className="form-input w-auto rounded-full py-2 ps-3 pe-8 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

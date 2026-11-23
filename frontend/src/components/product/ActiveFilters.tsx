import Link from 'next/link'

import { XIcon } from '@/components/common/Icons'
import {
  buildProductsHref,
  hasActiveFilters,
  priceRanges,
  type ProductQuery,
  RATING_FILTER,
} from '@/features/product/productQuery'
import type { Category } from '@/types/Category'

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={`Bỏ lọc: ${label}`}
      className="inline-flex items-center gap-x-1.5 rounded-full border border-brand-primary/30 bg-brand-primary-light py-1 ps-3 pe-2 text-sm text-brand-primary no-underline transition-colors hover:border-brand-primary"
    >
      {label}
      <XIcon className="size-3.5" strokeWidth={2} />
    </Link>
  )
}

// Các bộ lọc đang áp dụng, bấm vào chip để bỏ từng cái
export default function ActiveFilters({
  query,
  categories,
}: {
  query: ProductQuery
  categories: Category[]
}) {
  if (!hasActiveFilters(query)) return null

  const category = categories.find((item) => item.slug === query.category)
  const price = priceRanges.find((item) => item.value === query.price)

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {query.q && <Chip href={buildProductsHref(query, { q: '' })} label={`“${query.q}”`} />}
      {category && (
        <Chip href={buildProductsHref(query, { category: null })} label={category.name} />
      )}
      {price && <Chip href={buildProductsHref(query, { price: null })} label={price.label} />}
      {query.rating && (
        <Chip
          href={buildProductsHref(query, { rating: false })}
          label={`Từ ${RATING_FILTER} sao`}
        />
      )}
      <Link
        href={buildProductsHref(query, { q: '', category: null, price: null, rating: false })}
        scroll={false}
        className="ms-1 text-sm text-neutral-500 underline-offset-2 hover:text-brand-primary"
      >
        Xóa tất cả
      </Link>
    </div>
  )
}

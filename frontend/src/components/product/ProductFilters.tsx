import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  buildProductsHref,
  hasActiveFilters,
  priceRanges,
  type ProductQuery,
  RATING_FILTER,
} from '@/features/product/productQuery'

import StarRating from './StarRating'

interface ProductFiltersProps {
  query: ProductQuery
  // Không có sản phẩm nào niêm yết giá (toàn "Liên hệ") thì ẩn nhóm "Khoảng giá", vì lọc theo giá
  // lúc đó không có tác dụng gì (xem hasPricedProducts() trong productAPI.ts).
  showPriceFilter: boolean
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold tracking-wide text-neutral-900 uppercase">{title}</h3>
      <ul className="m-0 list-none space-y-1 p-0">{children}</ul>
    </section>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={active ? 'true' : undefined}
        className={`flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm no-underline transition-colors ${
          active
            ? 'bg-brand-primary-light font-semibold text-brand-primary'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-brand-primary'
        }`}
      >
        {children}
      </Link>
    </li>
  )
}

/*
  Bộ lọc: khoảng giá + đánh giá, mỗi lựa chọn là một <Link> (Server Component, không cần JS).
  Danh mục nằm ở CategorySidebar (cột trái) từ 23/11/2026.
  Chỉ trả về NỘI DUNG; khung ẩn/hiện (drawer mobile, sidebar desktop) do FiltersDrawer đảm nhiệm.
*/
export default function ProductFilters({ query, showPriceFilter }: ProductFiltersProps) {
  return (
    <>
      <FilterGroup title="Đánh giá">
        <FilterLink
          href={buildProductsHref(query, { rating: !query.rating })}
          active={query.rating}
        >
          <StarRating value={RATING_FILTER} />
          từ {RATING_FILTER} sao
        </FilterLink>
      </FilterGroup>

      {showPriceFilter && (
        <FilterGroup title="Khoảng giá">
          {priceRanges.map((range) => {
            const active = query.price === range.value
            return (
              <FilterLink
                key={range.value}
                // Bấm lại khoảng giá đang chọn thì bỏ chọn
                href={buildProductsHref(query, { price: active ? null : range.value })}
                active={active}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    active ? 'border-brand-primary' : 'border-neutral-300'
                  }`}
                  aria-hidden="true"
                >
                  {active && <span className="size-2 rounded-full bg-brand-primary" />}
                </span>
                {range.label}
              </FilterLink>
            )
          })}
        </FilterGroup>
      )}

      {hasActiveFilters(query) && (
        <Link
          href={buildProductsHref(query, { q: '', category: null, price: null, rating: false })}
          scroll={false}
          className="btn btn-outline-primary rounded-full py-2 text-sm font-semibold"
        >
          Xóa tất cả bộ lọc
        </Link>
      )}
    </>
  )
}

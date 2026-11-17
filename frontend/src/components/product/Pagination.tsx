import Link from 'next/link'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/Icons'
import { buildProductsHref, type ProductQuery } from '@/features/product/productQuery'

// id của khung danh sách: đổi trang thì cuộn về đầu danh sách thay vì đầu trang
export const PRODUCT_LIST_ID = 'product-list'

// Nút tròn dùng chung cho số trang, mũi tên và dấu "..."
const pageLinkClass = 'flex size-10 items-center justify-center rounded-full text-sm font-medium'

// Luôn hiện trang đầu, trang cuối và 1 trang mỗi bên trang hiện tại; chỗ trống là "..."
function getPageItems(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)

  const items: (number | 'gap')[] = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push('gap')
    items.push(page)
  })
  return items
}

interface PaginationProps {
  query: ProductQuery
  page: number
  totalPages: number
}

export default function Pagination({ query, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  const href = (target: number) =>
    `${buildProductsHref(query, { page: target })}#${PRODUCT_LIST_ID}`

  return (
    <nav aria-label="Phân trang sản phẩm" className="mt-10">
      <ul className="m-0 flex flex-wrap items-center justify-center gap-1.5 p-0 sm:gap-1">
        <li>
          {page === 1 ? (
            <span className={`${pageLinkClass} text-neutral-300`} aria-hidden="true">
              <ChevronLeftIcon className="size-4" strokeWidth={2} />
            </span>
          ) : (
            <Link
              href={href(page - 1)}
              aria-label="Trang trước"
              className={`${pageLinkClass} text-neutral-900 hover:bg-brand-primary-light hover:text-brand-primary`}
            >
              <ChevronLeftIcon className="size-4" strokeWidth={2} />
            </Link>
          )}
        </li>

        {getPageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`}>
              <span className={`${pageLinkClass} text-neutral-400`}>…</span>
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-label={`Trang ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={`${pageLinkClass} ${
                  item === page
                    ? 'bg-brand-primary text-white'
                    : 'text-neutral-900 hover:bg-brand-primary-light hover:text-brand-primary'
                }`}
              >
                {item}
              </Link>
            </li>
          )
        )}

        <li>
          {page === totalPages ? (
            <span className={`${pageLinkClass} text-neutral-300`} aria-hidden="true">
              <ChevronRightIcon className="size-4" strokeWidth={2} />
            </span>
          ) : (
            <Link
              href={href(page + 1)}
              aria-label="Trang sau"
              className={`${pageLinkClass} text-neutral-900 hover:bg-brand-primary-light hover:text-brand-primary`}
            >
              <ChevronRightIcon className="size-4" strokeWidth={2} />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

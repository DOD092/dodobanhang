import Link from 'next/link'

import { PackageIcon } from '@/components/common/Icons'
import { searchProducts } from '@/features/product/productAPI'
import {
  buildProductsHref,
  hasActiveFilters,
  type ProductQuery,
} from '@/features/product/productQuery'

import Pagination from './Pagination'
import ProductCard from './ProductCard'

// Số thẻ tải ảnh ngay (hàng đầu ở desktop); thẻ còn lại lazy load khi cuộn tới
const EAGER_COUNT = 4

interface ProductGridProps {
  query: ProductQuery
}

// Server Component async: lấy dữ liệu theo bộ lọc. Bọc trong <Suspense> ở trang để stream skeleton trước.
export default async function ProductGrid({ query }: ProductGridProps) {
  const { items, total, page, pageSize, totalPages } = await searchProducts(query)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
        <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
          <PackageIcon className="size-8" />
        </span>
        <h2 className="mb-2 text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2>
        <p className="mx-auto mb-6 max-w-md text-neutral-600">
          Thử từ khóa khác, bỏ bớt bộ lọc, hoặc liên hệ để chúng tôi tư vấn sản phẩm phù hợp.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {hasActiveFilters(query) && (
            <Link
              href={buildProductsHref(query, { q: '', category: null, price: null, rating: false })}
              scroll={false}
              className="btn btn-outline-primary rounded-full px-6 py-2 font-semibold"
            >
              Xóa bộ lọc
            </Link>
          )}
          <Link href="/contact" className="btn btn-primary rounded-full px-6 py-2 font-semibold">
            Liên hệ tư vấn
          </Link>
        </div>
      </div>
    )
  }

  const from = (page - 1) * pageSize + 1
  const to = from + items.length - 1

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600" aria-live="polite">
        Hiển thị{' '}
        <strong className="text-neutral-900">
          {from}–{to}
        </strong>{' '}
        trong <strong className="text-neutral-900">{total}</strong> sản phẩm
      </p>

      <ul className="mb-0 grid list-none grid-cols-2 gap-2 p-0 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
        {items.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} eager={index < EAGER_COUNT} />
          </li>
        ))}
      </ul>

      <Pagination query={query} page={page} totalPages={totalPages} />
    </div>
  )
}

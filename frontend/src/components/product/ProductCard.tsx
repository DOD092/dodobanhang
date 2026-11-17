import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/components/common/Icons'
import type { Product } from '@/types/Product'
import { formatPrice } from '@/utils/formatPrice'
import { productImages } from '@/utils/imageUrl'
import { productPath } from '@/utils/slug'

interface ProductCardProps {
  product: Product
  categoryName?: string
  // Ảnh ở màn hình đầu tiên (above the fold) tải ngay; còn lại lazy load (mặc định của next/image)
  eager?: boolean
}

// Thẻ sản phẩm lẻ: cả thẻ dẫn tới /products/<slug>. Cùng kiểu hover với CategoryCard.
export default function ProductCard({ product, categoryName, eager = false }: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-b-4 border-neutral-300 bg-white shadow-md transition hover:-translate-y-1 hover:border-b-brand-primary hover:shadow-xl">
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        <Image
          src={productImages(product.images)[0]}
          alt={product.name}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
        />
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-primary shadow-sm">
            {categoryName}
          </span>
        )}
      </div>

      <div className="flex grow flex-col p-[1rem] sm:p-5">
        {product.sku && (
          <p className="mb-1 text-xs tracking-wide text-neutral-500">{product.sku}</p>
        )}
        <h3 className="mb-2 text-base font-bold sm:text-lg">{product.name}</h3>
        <p className="mb-3 line-clamp-2 grow text-sm text-neutral-600">{product.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          {product.price !== null ? (
            <span className="font-bold text-brand-primary sm:text-lg">
              {formatPrice(product.price)}
            </span>
          ) : (
            // Chưa niêm yết giá: nút bấm thẳng tới trang liên hệ, không chỉ là chữ. `relative z-10`
            // để nổi lên trên lớp phủ `after:` của link "Chi tiết" bên dưới và vẫn bấm riêng được.
            <Link
              href="/contact"
              aria-label={`Liên hệ về ${product.name}`}
              className="btn btn-outline-primary relative z-10 rounded-full px-3 py-1 text-xs sm:text-sm"
            >
              Liên hệ
            </Link>
          )}
          {/* after:absolute after:inset-0 phủ link lên cả thẻ */}
          <Link
            href={productPath(product)}
            aria-label={`Xem chi tiết ${product.name}`}
            className="inline-flex items-center gap-x-1 text-sm font-semibold text-neutral-900 no-underline after:absolute after:inset-0 group-hover:text-brand-primary"
          >
            Chi tiết
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}

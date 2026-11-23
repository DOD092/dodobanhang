import Image from 'next/image'
import Link from 'next/link'

import type { Product } from '@/types/Product'
import { formatPrice } from '@/utils/formatPrice'
import { productImages } from '@/utils/imageUrl'
import { productPath } from '@/utils/slug'

import StarRating, { formatSold } from './StarRating'

interface ProductCardProps {
  product: Product
  // Ảnh ở màn hình đầu tiên (above the fold) tải ngay; còn lại lazy load (mặc định của next/image)
  eager?: boolean
}

/*
  Thẻ sản phẩm kiểu sàn TMĐT (23/11/2026): ảnh vuông -> giá + % giảm -> tác giả/thương hiệu (chữ
  hoa, xám) -> tên (2 dòng) -> sao + "Đã bán". Cả thẻ là 1 link tới /products/<slug>.
  Giá null = "Liên hệ". Thương hiệu mặc định "Chưa phân loại" thì không hiện.
*/
export default function ProductCard({ product, eager = false }: ProductCardProps) {
  const byline = product.author || (product.brandName !== 'Chưa phân loại' ? product.brandName : '')
  const hasRating = product.ratingAverage !== null && product.reviewCount > 0

  return (
    <Link
      href={productPath(product)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-inherit no-underline transition hover:border-neutral-300 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={productImages(product.images)[0]}
          alt={product.name}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 50vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-brand-coral px-1.5 py-0.5 text-xs font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="flex grow flex-col gap-1 p-3">
        {product.price !== null ? (
          <p className="mb-0 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-base font-bold text-red-600 sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice !== null && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
        ) : (
          <p className="mb-0 text-base font-bold text-brand-primary">Liên hệ</p>
        )}

        {byline && (
          <p className="mb-0 truncate text-xs tracking-wide text-neutral-500 uppercase">{byline}</p>
        )}
        <h3 className="mb-0 line-clamp-2 text-sm leading-snug font-normal text-neutral-900 group-hover:text-brand-primary">
          {product.name}
        </h3>

        {(hasRating || product.soldCount > 0) && (
          <p className="mt-auto mb-0 flex items-center gap-x-1.5 pt-1 text-xs text-neutral-500">
            {hasRating && (
              <StarRating value={product.ratingAverage as number} className="text-xs" />
            )}
            {hasRating && product.soldCount > 0 && (
              <span className="h-3 w-px bg-neutral-300" aria-hidden="true" />
            )}
            {product.soldCount > 0 && <span>Đã bán {formatSold(product.soldCount)}</span>}
          </p>
        )}
      </div>
    </Link>
  )
}

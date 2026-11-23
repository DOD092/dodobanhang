import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Breadcrumbs from '@/components/common/Breadcrumbs'
import ExpandableText from '@/components/product/ExpandableText'
import ProductCard from '@/components/product/ProductCard'
import ProductGallery from '@/components/product/ProductGallery'
import BuyBox from '@/components/product/purchase/BuyBox'
import PriceAndVariants from '@/components/product/purchase/PriceAndVariants'
import { PurchaseProvider } from '@/components/product/purchase/PurchaseContext'
import StarRating, { formatSold } from '@/components/product/StarRating'
import { siteConfig } from '@/config/site'
import { getProductBySlug, getProductsByCategory } from '@/features/product/productAPI'
import { buildProductsHref, defaultProductQuery } from '@/features/product/productQuery'
import { productImages } from '@/utils/imageUrl'

const RELATED_LIMIT = 8

// Giá trị thông số crawl từ Tiki: ngày dạng 'YYYY-MM-DD 00:00:00' -> 'DD/MM/YYYY'
function formatSpecValue(value: string) {
  const date = /^(\d{4})-(\d{2})-(\d{2})(?: 00:00:00)?$/.exec(value.trim())
  return date ? `${date[3]}/${date[2]}/${date[1]}` : value
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }> // slug lưu trong DB (cột products.slug, UNIQUE), xem utils/slug.ts
}

// Không có generateStaticParams: dữ liệu lấy từ backend và trang render theo từng request
// (xem apis/server.ts). Slug không tồn tại hoặc sản phẩm đang ẩn thì 404 thật (`not-found.tsx`).

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  if (!product) return { title: `Không tìm thấy sản phẩm - ${siteConfig.shortName}` }

  const description = product.shortDescription ?? product.description?.slice(0, 160) ?? undefined
  return {
    title: `${product.name} - ${siteConfig.shortName}`,
    description,
    openGraph: { title: product.name, description },
  }
}

/*
  Trang chi tiết kiểu sàn TMĐT (23/11/2026). >= lg: 3 cột
    [ảnh + dải ảnh nhỏ] [tác giả, tên, sao | đã bán, giá, phân loại] [khung mua: số lượng, tạm tính, nút]
  bên dưới: "Thông tin chi tiết" (bảng thông số), "Mô tả sản phẩm" (thu gọn), "Sản phẩm tương tự".
  Cột giữa và khung mua dùng chung state qua PurchaseProvider (biến thể, số lượng).
*/
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const { category } = product
  const path = product.categoryPath.length > 0 ? product.categoryPath : [category]
  // Lấy dư 1 vì danh sách có thể chứa chính sản phẩm này. Nhóm lá ít sản phẩm (vd 'Sách kinh tế'
  // chỉ 1 cuốn) thì lấy từ nhóm cha (backend lọc cả cây con nên đã gồm nhóm lá).
  const parent = path.length > 1 ? path[path.length - 2] : undefined
  let pool = await getProductsByCategory(category.slug, RELATED_LIMIT + 1)
  if (pool.length <= RELATED_LIMIT / 2 && parent) {
    pool = await getProductsByCategory(parent.slug, RELATED_LIMIT + 1)
  }
  const related = pool.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT)
  const relatedCategory =
    pool.some((item) => item.category.id !== category.id) && parent ? parent : category
  const categoryHref = (categorySlug: string) =>
    buildProductsHref(defaultProductQuery, { category: categorySlug })
  const hasRating = product.ratingAverage !== null && product.reviewCount > 0
  const byline = product.author
    ? { label: 'Tác giả', value: product.author }
    : product.brandName && product.brandName !== 'Chưa phân loại'
      ? { label: 'Thương hiệu', value: product.brandName }
      : null

  return (
    <div className="bg-neutral-100 pb-12">
      <div className="container py-3">
        <Breadcrumbs
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
            ...path.map((node) => ({ label: node.name, href: categoryHref(node.slug) })),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container space-y-4">
        <PurchaseProvider variants={product.variants}>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)_300px]">
            <div className="rounded-xl bg-white p-4 md:sticky md:top-24">
              <ProductGallery images={productImages(product.images)} alt={product.name} />
            </div>

            <div className="space-y-4">
              <section className="space-y-3 rounded-xl bg-white p-4 md:p-5">
                {byline && (
                  <p className="mb-0 text-sm text-neutral-600">
                    {byline.label}:{' '}
                    <span className="font-medium text-brand-primary">{byline.value}</span>
                  </p>
                )}
                <h1 className="mb-0 text-xl leading-snug font-semibold md:text-2xl">
                  {product.name}
                </h1>
                {(hasRating || product.soldCount > 0) && (
                  <p className="mb-0 flex flex-wrap items-center gap-x-2 text-sm text-neutral-600">
                    {hasRating && (
                      <>
                        <span className="font-semibold text-neutral-900">
                          {product.ratingAverage?.toLocaleString('vi-VN')}
                        </span>
                        <StarRating value={product.ratingAverage as number} />
                        <span>({product.reviewCount.toLocaleString('vi-VN')})</span>
                      </>
                    )}
                    {hasRating && product.soldCount > 0 && (
                      <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
                    )}
                    {product.soldCount > 0 && <span>Đã bán {formatSold(product.soldCount)}</span>}
                  </p>
                )}
                <PriceAndVariants productName={product.name} />
              </section>

              {product.specifications.length > 0 && (
                <section className="rounded-xl bg-white p-4 md:p-5">
                  <h2 className="mb-3 text-lg font-bold">Thông tin chi tiết</h2>
                  <dl className="m-0 divide-y divide-neutral-200 text-sm">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.name}
                        className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2"
                      >
                        <dt className="text-neutral-500">{spec.name}</dt>
                        <dd className="m-0 break-words text-neutral-900">
                          {formatSpecValue(spec.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {product.description && (
                <section className="rounded-xl bg-white p-4 md:p-5">
                  <h2 className="mb-3 text-lg font-bold">Mô tả sản phẩm</h2>
                  <ExpandableText text={product.description} />
                </section>
              )}
            </div>

            <aside className="rounded-xl bg-white p-4 md:col-span-2 lg:sticky lg:top-24 lg:col-span-1">
              <BuyBox />
              <p className="mt-4 mb-0 border-t border-neutral-200 pt-3 text-xs text-neutral-500">
                Cần tư vấn?{' '}
                <a href={`tel:${siteConfig.phone}`} className="font-semibold text-brand-primary">
                  {siteConfig.phone}
                </a>{' '}
                ({siteConfig.hours})
              </p>
            </aside>
          </div>
        </PurchaseProvider>

        {related.length > 0 && (
          <section className="rounded-xl bg-white p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="mb-0 text-lg font-bold">Sản phẩm tương tự</h2>
              <Link
                href={categoryHref(relatedCategory.slug)}
                className="text-sm font-semibold text-brand-primary no-underline hover:underline"
              >
                Xem tất cả {relatedCategory.name}
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:gap-3 md:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

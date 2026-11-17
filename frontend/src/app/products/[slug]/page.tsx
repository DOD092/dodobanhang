import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ContactCta from '@/components/common/ContactCta'
import { PhoneCallIcon } from '@/components/common/Icons'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductCard from '@/components/product/ProductCard'
import ProductGallery from '@/components/product/ProductGallery'
import { siteConfig } from '@/config/site'
import { getProductBySlug, getProductsByCategory } from '@/features/product/productAPI'
import { buildProductsHref, defaultProductQuery } from '@/features/product/productQuery'
import { formatPrice } from '@/utils/formatPrice'
import { productImages } from '@/utils/imageUrl'

const RELATED_LIMIT = 4

interface ProductDetailPageProps {
  params: Promise<{ slug: string }> // slug lưu trong DB (cột products.slug, UNIQUE), xem utils/slug.ts
}

// Không có generateStaticParams: dữ liệu lấy từ backend và trang render theo từng request
// (xem apis/server.ts). Slug không tồn tại hoặc sản phẩm đang ẩn thì 404 thật (`not-found.tsx`).

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  if (!product) return { title: `Không tìm thấy sản phẩm - ${siteConfig.shortName}` }

  const description = product.shortDescription ?? product.description ?? undefined
  return {
    title: `${product.name} - ${siteConfig.shortName}`,
    description,
    // Thêm `images` khi có ảnh thật + domain (cần metadataBase trong app/layout.tsx)
    openGraph: { title: product.name, description },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const { category } = product
  // Lấy dư 1 vì danh sách có thể chứa chính sản phẩm này
  const sameCategory = await getProductsByCategory(category.slug, RELATED_LIMIT + 1)
  const related = sameCategory.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT)
  const categoryHref = buildProductsHref(defaultProductQuery, { category: category.slug })

  return (
    <>
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="container py-3">
          <Breadcrumbs
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Sản phẩm', href: '/products' },
              { label: category.name, href: categoryHref },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <section className="container py-8 md:py-14">
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:gap-10">
          <ProductGallery images={productImages(product.images)} alt={product.name} />

          <div>
            <Link
              href={categoryHref}
              className="mb-3 inline-block rounded-full bg-brand-primary-light px-3 py-1 text-sm font-semibold text-brand-primary no-underline hover:bg-brand-primary hover:text-white"
            >
              {category.name}
            </Link>
            <span className="mb-3 block h-1 w-12 bg-brand-primary" aria-hidden="true" />
            <h1 className="mb-2 text-2xl font-bold md:text-4xl">{product.name}</h1>
            {product.sku && (
              <p className="mb-4 text-sm text-neutral-500">
                Mã sản phẩm: <span className="font-semibold text-neutral-900">{product.sku}</span>
              </p>
            )}

            {product.price !== null ? (
              <>
                <p className="mb-1 text-sm text-neutral-500">Giá tham khảo</p>
                <p className="mb-6 text-3xl font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </p>
              </>
            ) : (
              <p className="mb-6 text-2xl font-bold text-brand-primary">Liên hệ để nhận báo giá</p>
            )}

            {product.description && (
              <p className="mb-6 text-neutral-700 md:text-lg">{product.description}</p>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="btn btn-primary flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold"
              >
                <PhoneCallIcon className="size-5" />
                Gọi {siteConfig.phone}
              </a>
              <Link
                href="/contact"
                className="btn btn-outline-primary rounded-full px-6 py-2.5 font-semibold"
              >
                Nhận báo giá
              </Link>
              {siteConfig.socials.zalo && (
                <a
                  href={siteConfig.socials.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary rounded-full px-6 py-2.5 font-semibold"
                >
                  Chat Zalo
                </a>
              )}
            </div>

            <ul className="m-0 list-none space-y-2 rounded-2xl bg-neutral-50 p-[1rem] text-sm text-neutral-700 sm:p-5">
              <li>• Giá có thể thay đổi theo số lượng, quy cách và thời điểm đặt hàng.</li>
              <li>• Vận chuyển toàn quốc, liên hệ để được báo phí giao hàng.</li>
              <li>• Giờ làm việc: {siteConfig.hours}.</li>
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
          <div className="container">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className="mb-0 text-xl font-bold tracking-wide uppercase md:text-2xl">
                Sản phẩm cùng nhóm
              </h2>
              <Link
                href={categoryHref}
                className="text-sm font-semibold no-underline hover:underline"
              >
                Xem tất cả {category.name}
              </Link>
            </div>
            <ul className="mb-0 grid grid-cols-2 gap-3 list-none p-0 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} categoryName={category.name} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="pt-12 md:pt-16">
        <ContactCta
          title="Cần báo giá sản phẩm này?"
          description="Gửi số lượng và quy cách, chúng tôi báo giá và tư vấn phương án giao hàng."
        />
      </div>
    </>
  )
}

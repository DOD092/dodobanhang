import type { Metadata } from 'next'
import { Suspense } from 'react'

import ContactCta from '@/components/common/ContactCta'
import type { BreadcrumbItem } from '@/components/common/Breadcrumbs'
import ImageBanner, { type BannerImage } from '@/components/common/ImageBanner'
import ActiveFilters from '@/components/product/ActiveFilters'
import * as FiltersDrawer from '@/components/product/FiltersDrawer'
import { PRODUCT_LIST_ID } from '@/components/product/Pagination'
import ProductFilters from '@/components/product/ProductFilters'
import ProductGrid from '@/components/product/ProductGrid'
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton'
import ProductSearch from '@/components/product/ProductSearch'
import SortSelect from '@/components/product/SortSelect'
import { siteConfig } from '@/config/site'
import { getCategories, getCategoryBySlug } from '@/features/category/categoryAPI'
import { hasPricedProducts } from '@/features/product/productAPI'
import { buildProductsHref, parseProductQuery } from '@/features/product/productQuery'

// Ảnh nền banner đầu trang: ảnh bìa web (chủ dự án thiết kế, 1360×540, cùng ảnh Hero trang chủ).
// Ảnh có sẵn logo, slogan, 4 biểu tượng nên dưới lớp phủ tối sẽ thành họa tiết mờ phía sau chữ.
const bannerImage: BannerImage = {
  src: '/images/home-banner.png',
  alt: `${siteConfig.shortName} - Thiết bị công nghiệp, chất lượng tạo nên niềm tin`,
  position: 'object-center',
}

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Tiêu đề tab theo nhóm đang lọc, vd "Inox - dodobanhang"
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const query = parseProductQuery(await searchParams)
  const category = query.category !== null ? await getCategoryBySlug(query.category) : undefined

  return {
    title: `${category?.name ?? 'Sản phẩm'} - ${siteConfig.shortName}`,
    description:
      category?.description ??
      'Vòng bi, phụ kiện cơ khí, vật liệu nhôm, thiết bị nông nghiệp, năng lượng mặt trời và đèn LED chiếu sáng. Tư vấn, báo giá nhanh.',
  }
}

// Server Component: đọc bộ lọc từ URL, dữ liệu lọc sẵn trên server nên trang hiện ra kèm kết quả
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [rawParams, categories, showPriceFilter] = await Promise.all([
    searchParams,
    getCategories(),
    hasPricedProducts(),
  ])

  const parsed = parseProductQuery(rawParams)
  // slug nhóm không tồn tại (link cũ, sửa tay) thì coi như không lọc theo nhóm
  const query = categories.some((item) => item.slug === parsed.category)
    ? parsed
    : { ...parsed, category: null }

  const activeCategory = categories.find((item) => item.slug === query.category)
  const totalCount = categories.reduce((sum, item) => sum + item.productCount, 0)
  const activeFilterCount = [query.q, query.category !== null, query.price].filter(Boolean).length

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    ...(activeCategory ? [{ label: activeCategory.name }] : []),
  ]

  return (
    <>
      <ImageBanner
        title={activeCategory?.name ?? 'Sản phẩm'}
        subtitle={
          activeCategory?.description ??
          'Vòng bi, phụ kiện cơ khí, vật liệu nhôm, thiết bị nông nghiệp, năng lượng mặt trời và đèn LED chiếu sáng.'
        }
        breadcrumbs={breadcrumbs}
        image={bannerImage}
      >
        <div className="mt-6 max-w-2xl">
          <ProductSearch query={query} />
        </div>
      </ImageBanner>

      <section className="container py-6 md:py-12">
        <FiltersDrawer.Root watchKey={buildProductsHref(query)}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-[260px_1fr] lg:gap-x-8">
            <FiltersDrawer.Panel>
              <ProductFilters
                query={query}
                categories={categories}
                totalCount={totalCount}
                showPriceFilter={showPriceFilter}
              />
            </FiltersDrawer.Panel>

            <div>
              {/* scroll-mt: chừa chỗ cho header dính khi phân trang cuộn về đây */}
              <div
                id={PRODUCT_LIST_ID}
                className="mb-4 flex scroll-mt-24 flex-wrap items-center justify-between gap-3"
              >
                <FiltersDrawer.Trigger activeFilterCount={activeFilterCount} />
                <div className="ms-auto">
                  <SortSelect query={query} showPriceSort={showPriceFilter} />
                </div>
              </div>

              <ActiveFilters query={query} categories={categories} />

              {/* key đổi theo bộ lọc: mỗi lần lọc lại hiện skeleton trong lúc stream kết quả mới */}
              <Suspense key={buildProductsHref(query)} fallback={<ProductGridSkeleton />}>
                <ProductGrid query={query} />
              </Suspense>
            </div>
          </div>
        </FiltersDrawer.Root>
      </section>

      <ContactCta />
    </>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'

import Breadcrumbs, { type BreadcrumbItem } from '@/components/common/Breadcrumbs'
import ActiveFilters from '@/components/product/ActiveFilters'
import CategorySidebar from '@/components/product/CategorySidebar'
import CategoryTiles from '@/components/product/CategoryTiles'
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
import { buildCategoryTree, findCategoryPath } from '@/utils/categoryTree'

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Tiêu đề tab theo nhóm đang lọc, vd "Sách văn học - dodobanhang"
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const query = parseProductQuery(await searchParams)
  const category = query.category !== null ? await getCategoryBySlug(query.category) : undefined

  return {
    title: `${category?.name ?? 'Tất cả sản phẩm'} - ${siteConfig.shortName}`,
    description:
      category?.description ??
      `Mua sắm cùng ${siteConfig.shortName}: chọn sản phẩm, đặt hàng online.`,
  }
}

/*
  Trang danh sách kiểu sàn TMĐT (23/11/2026):
  - Trái (>= lg; mobile là drawer "Bộ lọc"): CategorySidebar (cây danh mục) + bộ lọc giá / sao.
  - Phải: tiêu đề nhóm -> ô "Khám phá theo danh mục" (nhóm con) -> khung "Tất cả sản phẩm"
    (tìm kiếm, sắp xếp, chip bộ lọc, lưới 2/3/4 cột, phân trang).
  Server Component: bộ lọc đọc từ URL, dữ liệu lọc sẵn trên server.
*/
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [rawParams, categories, showPriceFilter] = await Promise.all([
    searchParams,
    getCategories(),
    hasPricedProducts(),
  ])

  const tree = buildCategoryTree(categories)
  const parsed = parseProductQuery(rawParams)
  const activePath = findCategoryPath(tree, parsed.category)
  // slug nhóm không tồn tại (link cũ, sửa tay) thì coi như không lọc theo nhóm
  const query = activePath.length > 0 ? parsed : { ...parsed, category: null }
  const activeCategory = activePath[activePath.length - 1]
  const activeFilterCount = [query.q, query.category !== null, query.price, query.rating].filter(
    Boolean
  ).length

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: activeCategory ? '/products' : undefined },
    ...activePath.map((node, index) => ({
      label: node.name,
      href:
        index < activePath.length - 1
          ? buildProductsHref(query, { category: node.slug })
          : undefined,
    })),
  ]
  // Ô danh mục: nhóm con của nhóm đang xem; nhóm lá thì hiện các nhóm cùng cấp
  const tiles = activeCategory
    ? activeCategory.children.length > 0
      ? activeCategory.children
      : (activePath[activePath.length - 2]?.children ?? [])
    : tree

  return (
    <div className="bg-neutral-100 pb-12">
      <div className="container py-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="container">
        <FiltersDrawer.Root watchKey={buildProductsHref(query)}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr] lg:items-start">
            <FiltersDrawer.Panel>
              <div className="space-y-6">
                <CategorySidebar tree={tree} query={query} activePath={activePath} />
                <ProductFilters query={query} showPriceFilter={showPriceFilter} />
              </div>
            </FiltersDrawer.Panel>

            <div className="min-w-0 space-y-4">
              <header className="rounded-xl bg-white px-4 py-5 md:px-6">
                <h1 className="mb-1 text-2xl font-bold md:text-3xl">
                  {activeCategory?.name ?? 'Tất cả sản phẩm'}
                </h1>
                {activeCategory?.description && (
                  <p className="mb-0 text-sm text-neutral-600">{activeCategory.description}</p>
                )}
              </header>

              <CategoryTiles categories={tiles} query={query} />

              <section className="rounded-xl bg-white p-3 md:p-5">
                {/* scroll-mt: chừa chỗ cho header dính khi phân trang cuộn về đây */}
                <div id={PRODUCT_LIST_ID} className="mb-4 scroll-mt-24 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="mb-0 text-base font-bold md:text-lg">Tất cả sản phẩm</h2>
                    <div className="flex items-center gap-2">
                      <FiltersDrawer.Trigger activeFilterCount={activeFilterCount} />
                      <SortSelect query={query} showPriceSort={showPriceFilter} />
                    </div>
                  </div>
                  <ProductSearch query={query} />
                </div>

                <ActiveFilters query={query} categories={categories} />

                {/* key đổi theo bộ lọc: mỗi lần lọc lại hiện skeleton trong lúc stream kết quả mới */}
                <Suspense key={buildProductsHref(query)} fallback={<ProductGridSkeleton />}>
                  <ProductGrid query={query} />
                </Suspense>
              </section>
            </div>
          </div>
        </FiltersDrawer.Root>
      </div>
    </div>
  )
}

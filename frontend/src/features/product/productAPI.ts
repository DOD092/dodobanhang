import { serverGet, serverGetOrUndefined } from '@/apis/server'
import type { Product, ProductDetail } from '@/types/Product'

import { PRODUCTS_PAGE_SIZE, priceRanges, type ProductQuery } from './productQuery'

export interface ProductPage {
  items: Product[]
  total: number
  page: number // trang thực tế: backend tự đưa về trang cuối nếu `page` vượt quá
  pageSize: number
  totalPages: number
}

// Tìm kiếm + lọc + sắp xếp + phân trang, làm hết ở backend (GET /api/products/search):
// tìm không dấu, nhiều từ thì phải khớp đủ; sản phẩm "Liên hệ" (giá null) luôn xếp cuối khi sắp
// theo giá và không khớp khoảng giá nào.
export async function searchProducts(
  query: ProductQuery,
  pageSize = PRODUCTS_PAGE_SIZE
): Promise<ProductPage> {
  const range = priceRanges.find((item) => item.value === query.price)

  return serverGet<ProductPage>('/products/search', {
    q: query.q,
    category: query.category,
    minPrice: range && 'min' in range ? range.min : undefined,
    maxPrice: range && 'max' in range ? range.max : undefined,
    sort: query.sort,
    page: query.page,
    limit: pageSize,
  })
}

// undefined = không có (hoặc đang ẩn) -> trang chi tiết gọi notFound()
export async function getProductBySlug(slug: string): Promise<ProductDetail | undefined> {
  return serverGetOrUndefined<ProductDetail>(`/products/slug/${encodeURIComponent(slug)}`)
}

// Sản phẩm cùng nhóm (trang chi tiết), mới nhất trước
export async function getProductsByCategory(
  categorySlug: string,
  limit: number
): Promise<Product[]> {
  const result = await serverGet<ProductPage>('/products/search', {
    category: categorySlug,
    limit,
  })
  return result.items
}

// Còn sản phẩm nào niêm yết giá không (khác "Liên hệ")? Dùng để ẩn bộ lọc/sắp xếp theo giá khi
// toàn bộ sản phẩm đều "Liên hệ" - tránh bộ lọc/tùy chọn không có tác dụng gì.
// minPrice=0 chỉ khớp sản phẩm có giá (giá null không khớp khoảng giá nào).
export async function hasPricedProducts(): Promise<boolean> {
  const result = await serverGet<ProductPage>('/products/search', { minPrice: 0, limit: 1 })
  return result.total > 0
}

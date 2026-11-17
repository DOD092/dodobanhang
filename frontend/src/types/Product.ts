import type { CategoryRef } from './Category'

// Khớp response GET /api/products/search và /api/products/slug/:slug của backend
// (backend/src/module/product/dto/product-catalog.dto.ts). Tên field camelCase như backend.
export interface Product {
  id: string // uuid
  slug: string // URL trang chi tiết: /products/<slug> (xem utils/slug.ts -> productPath)
  name: string
  shortDescription: string | null
  description: string | null
  category: CategoryRef
  sku: string | null // SKU của biến thể đầu tiên; null nếu sản phẩm chưa có biến thể
  price: number | null // giá thấp nhất trong các biến thể; null = "Liên hệ"
  // URL ảnh, ảnh chính trước. '/images/...' là ảnh tĩnh của frontend, '/uploads/...' là ảnh
  // backend lưu (đi qua utils/imageUrl.ts). Có thể rỗng nếu sản phẩm chưa có ảnh.
  images: string[]
}

export interface ProductVariant {
  id: string
  sku: string
  variantName: string
  price: number | null
}

export interface ProductDetail extends Product {
  variants: ProductVariant[]
}

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
  compareAtPrice: number | null // giá gốc (gạch ngang) của biến thể rẻ nhất; null = không giảm giá
  discountPercent: number // 0 = không giảm
  author: string | null // tác giả (sách) - hiện trên thẻ thay cho thương hiệu
  brandName: string
  ratingAverage: number | null // 0-5; null = chưa có đánh giá
  reviewCount: number
  soldCount: number
}

export interface ProductVariant {
  id: string
  sku: string
  variantName: string
  price: number | null
  compareAtPrice: number | null
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductDetail extends Product {
  variants: ProductVariant[]
  specifications: ProductSpecification[] // bảng "Thông tin chi tiết"
  categoryPath: CategoryRef[] // từ nhóm gốc tới nhóm của sản phẩm (breadcrumb)
}

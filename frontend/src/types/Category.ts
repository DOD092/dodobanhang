// Khớp response GET /api/categories/public của backend (chỉ các field frontend dùng).
export interface Category {
  id: string // uuid
  slug: string // dùng trên URL lọc: /products?category=<slug>
  name: string
  description: string | null
  productCount: number // số sản phẩm đang hiển thị trong nhóm
}

// Category gắn kèm mỗi Product
export type CategoryRef = Pick<Category, 'id' | 'name' | 'slug'>

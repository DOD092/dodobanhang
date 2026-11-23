// Khớp response GET /api/categories/public của backend (chỉ các field frontend dùng).
export interface Category {
  id: string // uuid
  slug: string // dùng trên URL lọc: /products?category=<slug>
  name: string
  description: string | null
  productCount: number // số sản phẩm đang hiển thị, GỘP cả nhóm con (khớp bộ lọc)
  parentId: string | null // null = nhóm gốc (cột trái "Khám phá theo danh mục")
  imageUrl: string | null // ảnh ô danh mục; URL tuyệt đối (Tiki) hoặc null
}

// Nút trong cây danh mục (utils/categoryTree.ts)
export interface CategoryNode extends Category {
  children: CategoryNode[]
}

// Category gắn kèm mỗi Product
export type CategoryRef = Pick<Category, 'id' | 'name' | 'slug'>

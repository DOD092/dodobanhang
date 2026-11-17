import { serverGet } from '@/apis/server'
import type { Category } from '@/types/Category'

// Nhóm sản phẩm đang hiển thị (status ACTIVE), kèm số sản phẩm. Backend sắp theo thời gian tạo.
export async function getCategories(): Promise<Category[]> {
  return serverGet<Category[]>('/categories/public')
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories()
  return categories.find((item) => item.slug === slug)
}

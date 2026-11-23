import type { Category, CategoryNode } from '@/types/Category'

// Dựng cây từ danh sách phẳng của GET /api/categories/public (mỗi nhóm có parentId).
// Nhóm có parentId trỏ tới nhóm không còn trong danh sách (bị ẩn) thì coi như nhóm gốc.
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [category.id, { ...category, children: [] }])
  )
  const roots: CategoryNode[] = []
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  // Nhóm nhiều sản phẩm lên trước, nhóm rỗng xuống cuối
  const sort = (list: CategoryNode[]) => {
    list.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name, 'vi'))
    list.forEach((node) => sort(node.children))
  }
  sort(roots)
  return roots
}

// Đường dẫn từ gốc tới nhóm có slug cho trước ([] nếu không có)
export function findCategoryPath(roots: CategoryNode[], slug: string | null): CategoryNode[] {
  if (!slug) return []
  for (const node of roots) {
    if (node.slug === slug) return [node]
    const path = findCategoryPath(node.children, slug)
    if (path.length > 0) return [node, ...path]
  }
  return []
}

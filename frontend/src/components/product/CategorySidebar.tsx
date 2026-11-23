import Link from 'next/link'

import { ChevronRightIcon } from '@/components/common/Icons'
import { buildProductsHref, type ProductQuery } from '@/features/product/productQuery'
import type { CategoryNode } from '@/types/Category'

/*
  Cột "Khám phá theo danh mục": nhóm gốc thu gọn / mở ra bằng <details> (không cần JS, chạy được
  trong Server Component). Nhánh chứa nhóm đang lọc thì mở sẵn. Nhóm con dẫn tới ?category=<slug>
  (backend lọc cả cây con, xem backend.md 7.8).
*/
export default function CategorySidebar({
  tree,
  query,
  activePath,
}: {
  tree: CategoryNode[]
  query: ProductQuery
  activePath: CategoryNode[] // từ gốc tới nhóm đang lọc
}) {
  const activeIds = new Set(activePath.map((node) => node.id))
  const href = (slug: string | null) => buildProductsHref(query, { category: slug })
  const linkClass = (active: boolean) =>
    `block rounded-md px-2 py-1.5 text-sm no-underline transition-colors ${
      active
        ? 'bg-brand-primary-light font-semibold text-brand-primary'
        : 'text-neutral-700 hover:text-brand-primary'
    }`

  return (
    <nav aria-label="Danh mục sản phẩm">
      <h2 className="mb-0 border-b border-neutral-200 px-1 pb-3 text-base font-bold">
        Khám phá theo danh mục
      </h2>
      <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
        <li className="py-2">
          <Link href={href(null)} scroll={false} className={linkClass(query.category === null)}>
            Tất cả sản phẩm
          </Link>
        </li>
        {tree.map((root) => {
          const active = query.category === root.slug
          if (root.children.length === 0) {
            return (
              <li key={root.id} className="py-2">
                <Link href={href(root.slug)} scroll={false} className={linkClass(active)}>
                  {root.name}
                </Link>
              </li>
            )
          }
          return (
            <li key={root.id} className="py-2">
              <details open={activeIds.has(root.id)} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-neutral-900 hover:text-brand-primary [&::-webkit-details-marker]:hidden">
                  {root.name}
                  <ChevronRightIcon
                    className="size-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="m-0 mt-1 list-none space-y-0.5 p-0 ps-3">
                  <li>
                    <Link href={href(root.slug)} scroll={false} className={linkClass(active)}>
                      Tất cả {root.name}
                    </Link>
                  </li>
                  {root.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={href(child.slug)}
                        scroll={false}
                        className={linkClass(activeIds.has(child.id))}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

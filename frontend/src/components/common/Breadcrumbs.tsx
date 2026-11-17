import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string // mục cuối (trang hiện tại) không có href
}

// Breadcrumb: các mục cách nhau bằng dấu "/", mục cuối là trang hiện tại (không phải link)
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 p-0 text-sm text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={`${item.label}-${index}`}
              className={`flex items-center gap-x-2 ${isLast ? 'line-clamp-1 text-neutral-900' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="text-inherit no-underline hover:underline">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

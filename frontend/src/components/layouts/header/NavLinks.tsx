'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/config/site'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export default function NavLinks() {
  const pathname = usePathname()

  // Mobile: danh sách dọc có kẻ ngăn cách; desktop (lg): hàng ngang, mục đang chọn gạch chân đỏ
  return (
    <ul className="m-0 flex w-full list-none flex-col divide-y divide-neutral-100 border-t border-neutral-200 p-0 lg:w-auto lg:flex-row lg:gap-6 lg:divide-y-0 lg:border-0 xl:gap-8">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`block py-3 text-sm tracking-wide whitespace-nowrap uppercase no-underline transition-colors hover:text-brand-primary lg:border-b-2 lg:py-2 xl:text-base ${
                active
                  ? 'font-semibold text-brand-primary lg:border-brand-primary'
                  : 'font-medium text-neutral-900 lg:border-transparent'
              }`}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

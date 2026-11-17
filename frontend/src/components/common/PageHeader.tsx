import type { ReactNode } from 'react'

import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  children?: ReactNode
  // Chừa thêm khoảng trống ở đáy để khối ngay sau đè lên mép dưới (khối đó tự đặt -mt-*), vd ảnh
  // đầu trang Giới thiệu
  overlapBottom?: boolean
  // Căn giữa breadcrumb, gạch đỏ, tiêu đề (đang dùng ở trang Giới thiệu); mặc định căn trái
  centered?: boolean
}

// Đầu trang con: breadcrumb + gạch đỏ + <h1> in hoa (cùng kiểu với ContactInfo), nền xám nhạt
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  children,
  overlapBottom = false,
  centered = false,
}: PageHeaderProps) {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div
        className={`container pt-8 md:pt-12 ${overlapBottom ? 'pb-24 md:pb-32' : 'pb-8 md:pb-12'} ${
          centered ? 'text-center' : ''
        }`}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={`mb-6 ${centered ? 'flex justify-center' : ''}`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <span
          className={`mb-4 block h-1 w-16 bg-brand-primary ${centered ? 'mx-auto' : ''}`}
          aria-hidden="true"
        />
        <h1 className="mb-2 text-3xl font-bold tracking-wide uppercase md:text-5xl">{title}</h1>
        {subtitle && (
          <p className={`mb-0 max-w-2xl text-neutral-600 md:text-lg ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

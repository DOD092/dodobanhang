import Image from 'next/image'
import type { ReactNode } from 'react'

import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs'

export interface BannerImage {
  src: string
  alt: string
  // Class object-position Tailwind (vd 'object-[center_40%]') giữ phần chính của ảnh khi banner dẹt
  // cắt bớt trên/dưới; viết nguyên chuỗi class ở nơi khai báo để Tailwind quét thấy
  position?: string
}

interface ImageBannerProps {
  title: string
  subtitle?: string
  breadcrumbs: BreadcrumbItem[]
  image: BannerImage
  // Chừa thêm khoảng trống ở đáy để khối ngay sau tự đặt -mt-* đè lên mép dưới banner
  overlapBottom?: boolean
  // Nội dung phụ dưới tiêu đề, vd ô tìm kiếm ở /products
  children?: ReactNode
}

/*
  Đầu trang dạng banner ảnh nền (thay PageHeader nền xám ở các trang muốn có ảnh): ảnh phủ kín +
  lớp phủ tối đậm bên trái (chỗ chữ) nhạt dần sang phải để vẫn thấy ảnh, chữ trắng. Ảnh tĩnh, là
  ảnh LCP nên preload. Dùng ở /about, /services, /products.
*/
export default function ImageBanner({
  title,
  subtitle,
  breadcrumbs,
  image,
  overlapBottom = false,
  children,
}: ImageBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        preload
        sizes="100vw"
        className={`-z-20 object-cover ${image.position ?? ''}`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/20"
      />
      <div
        className={`container flex min-h-80 flex-col justify-center pt-10 md:min-h-104 lg:min-h-120 ${
          overlapBottom ? 'pb-24 md:pb-32' : 'pb-10 md:pb-14'
        }`}
      >
        {/* Breadcrumbs mặc định chữ xám/đen cho nền sáng, đổi sang trắng trên nền ảnh tối */}
        <div className="mb-6 [&_ol]:text-neutral-300 [&_[aria-current]]:text-white">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <span className="mb-4 block h-1 w-16 bg-brand-primary" aria-hidden="true" />
        <h1 className="mb-0 text-3xl font-bold tracking-wide uppercase md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 mb-0 max-w-2xl text-neutral-200 md:text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

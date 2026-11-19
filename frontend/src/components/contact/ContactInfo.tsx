import Image from 'next/image'
import type { ReactNode } from 'react'

import { ClockIcon, MailIcon, MapPinIcon, PhoneCallIcon } from '@/components/common/Icons'
import { mapUrl, siteConfig } from '@/config/site'

function InfoRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-x-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-brand-primary">
        {icon}
      </span>
      <div className="min-w-0 text-base break-words md:text-xl">{children}</div>
    </li>
  )
}

// Khối "Liên hệ chúng tôi": SĐT, email, địa chỉ, giờ làm việc (lấy từ siteConfig). Nền là ảnh bìa
// web + lớp phủ tối, chữ trắng, cùng kiểu ImageBanner ở /about, /services, /products (trước đây nền
// xám nhạt + hoạ tiết tổ ong SVG). Ảnh là ảnh LCP của trang nên preload.
export default function ContactInfo() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-primary text-white">
      <Image
        src="/images/banner-bg.png"
        alt={`${siteConfig.shortName} - Mua sắm cùng dodo, đặt hàng ngay`}
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-brand-primary/95 via-brand-primary/70 to-brand-primary/30"
      />

      <div className="container py-12 md:py-16">
        <span className="mb-4 block h-1 w-16 bg-brand-accent" aria-hidden="true" />
        <h1 className="mb-2 text-3xl font-bold tracking-wide uppercase md:text-5xl">
          Liên hệ chúng tôi
        </h1>
        <p className="mb-8 text-neutral-200 md:text-lg">Để biết thêm thông tin cần thiết nhé!</p>

        <ul className="m-0 list-none space-y-4 p-0">
          <InfoRow icon={<PhoneCallIcon className="size-5" />}>
            <a
              href={`tel:${siteConfig.phone}`}
              className="text-inherit no-underline hover:underline"
            >
              {siteConfig.phone}
            </a>
          </InfoRow>
          <InfoRow icon={<MailIcon className="size-5" />}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-inherit no-underline hover:underline"
            >
              {siteConfig.email}
            </a>
          </InfoRow>
          <InfoRow icon={<MapPinIcon className="size-5" />}>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline hover:underline"
            >
              {siteConfig.address}
            </a>
          </InfoRow>
          <InfoRow icon={<ClockIcon className="size-5" />}>
            Giờ làm việc: {siteConfig.hours}
          </InfoRow>
        </ul>
      </div>
    </section>
  )
}

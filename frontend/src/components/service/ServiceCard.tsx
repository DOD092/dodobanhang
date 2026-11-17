import Link from 'next/link'

import { ArrowRightIcon } from '@/components/common/Icons'
import type { Service } from '@/types/Service'

import { getServiceIcon } from './serviceIcons'

interface ServiceCardProps {
  service: Service
  href?: string // nơi cả thẻ dẫn tới; mặc định là form liên hệ
  linkLabel?: string
}

// Thẻ dịch vụ dạng icon (khác thẻ ảnh của sản phẩm). Cả thẻ bấm được (mặc định dẫn tới form liên hệ;
// trang chi tiết truyền href tới trang chi tiết của dịch vụ khác).
export default function ServiceCard({
  service,
  href = '/contact',
  linkLabel = 'Tư vấn ngay',
}: ServiceCardProps) {
  const Icon = getServiceIcon(service.id)

  // Mobile: thẻ ngang (icon trái) cho gọn; từ sm: thẻ dọc (icon trên)
  return (
    <article className="group relative flex h-full gap-x-4 rounded-2xl border-2 border-b-4 border-neutral-300 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-b-brand-primary hover:shadow-xl sm:flex-col">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white sm:mb-4 sm:size-14">
        <Icon className="size-6 sm:size-7" />
      </span>
      <div className="flex grow flex-col">
        <h3 className="mb-2 text-lg font-bold">{service.name}</h3>
        <p className="mb-4 grow text-sm text-neutral-600">{service.description}</p>
        {/* after:absolute after:inset-0 phủ link lên cả thẻ */}
        <Link
          href={href}
          aria-label={`${linkLabel} về ${service.name}`}
          className="inline-flex items-center gap-x-1 text-sm font-semibold text-brand-primary no-underline after:absolute after:inset-0"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

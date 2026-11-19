import Link from 'next/link'

import { PhoneCallIcon } from '@/components/common/Icons'
import { siteConfig } from '@/config/site'

interface ContactCtaProps {
  title?: string
  description?: string
}

// Khối kêu gọi liên hệ nền xanh thương hiệu, nút vàng (cuối trang sản phẩm, chi tiết sản phẩm)
export default function ContactCta({
  title = 'Chưa tìm thấy sản phẩm cần mua?',
  description = 'Liên hệ để được tư vấn và báo giá theo nhu cầu, số lượng của bạn.',
}: ContactCtaProps) {
  return (
    <section className="container pb-16">
      <div className="flex flex-col items-start gap-6 rounded-3xl border-t-4 border-brand-accent bg-brand-primary p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 className="mb-2 text-xl font-bold md:text-2xl">{title}</h2>
          <p className="mb-0 max-w-xl text-white/75">{description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={`tel:${siteConfig.phone}`}
            className="btn flex items-center gap-2 rounded-full bg-brand-accent px-6 py-2 font-semibold text-brand-primary hover:bg-brand-accent-dark"
          >
            <PhoneCallIcon className="size-5" />
            {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="btn btn-outline-light rounded-full px-6 py-2 font-semibold"
          >
            Gửi yêu cầu tư vấn
          </Link>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'

import ContactCta from '@/components/common/ContactCta'
import ImageBanner, { type BannerImage } from '@/components/common/ImageBanner'
import ServicePanel from '@/components/service/ServicePanel'
import { siteConfig } from '@/config/site'
import { getServices } from '@/features/service/serviceAPI'

// Ảnh nền banner đầu trang: ảnh Hero trang chủ đã xoá nửa trái có chữ (public/images/banner-bg.png, 1440×520), chỉ còn hình cửa hàng bên phải.
// Ảnh có sẵn logo, slogan, 4 biểu tượng nên dưới lớp phủ tối sẽ thành họa tiết mờ phía sau chữ.
const bannerImage: BannerImage = {
  src: '/images/banner-bg.png',
  alt: `${siteConfig.shortName} - Mua sắm cùng dodo, đặt hàng ngay`,
  position: 'object-right',
}

export const metadata: Metadata = {
  title: `Dịch vụ - ${siteConfig.shortName}`,
  description: siteConfig.servicesIntro,
}

const MAX_PANELS_PER_ROW = 3 // nhiều hơn thì panel thu gọn quá hẹp

interface Row<T> {
  items: T[]
  start: number // vị trí của phần tử đầu hàng trong danh sách gốc (dùng làm key của hàng)
}

// Chia đều vào các hàng (tối đa 3/hàng) để hàng cuối không bị lẻ 1 panel dãn hết chiều ngang.
// Ví dụ: 1 -> [1], 2 -> [2], 4 -> [2, 2], 5 -> [3, 2], 7 -> [3, 2, 2].
function splitIntoRows<T>(items: T[], maxPerRow: number): Row<T>[] {
  const rowCount = Math.ceil(items.length / maxPerRow)
  const rows: Row<T>[] = []
  let start = 0
  for (let i = 0; i < rowCount; i++) {
    const size = Math.ceil((items.length - start) / (rowCount - i))
    rows.push({ items: items.slice(start, start + size), start })
    start += size
  }
  return rows
}

// Server Component, không đọc searchParams nên được build sẵn thành HTML tĩnh
export default async function ServicesPage() {
  const services = await getServices()
  const rows = splitIntoRows(services, MAX_PANELS_PER_ROW)

  return (
    <>
      <ImageBanner
        title="Dịch vụ"
        subtitle={siteConfig.servicesIntro}
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Dịch vụ' }]}
        image={bannerImage}
      />

      <section className="container py-10 md:py-16">
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center md:p-12">
            <p className="mb-0 text-neutral-600 md:text-lg">
              Danh sách dịch vụ đang được cập nhật. Vui lòng liên hệ để được tư vấn.
            </p>
          </div>
        ) : (
          <>
            {/* Mỗi hàng là 1 <ul>; hover giãn panel trong từng hàng.
                lg:min-h-136 (34rem): chiều cao tối thiểu để panel ít nhảy khi mở chi tiết; chi tiết
                dài hơn thì hàng tự cao thêm (không bị cắt chữ).
                Hàng chỉ có 1 panel: giới hạn chiều rộng và căn giữa, tránh panel dãn hết khung.
                Không dùng `m-0` ở đây: `.m-0` của Bootstrap có !important, sẽ chặn `lg:mx-auto`. */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {rows.map((row) => (
                <ul
                  key={row.start}
                  className={`mb-0 flex list-none flex-col gap-4 p-0 lg:min-h-136 lg:flex-row lg:gap-5 ${
                    row.items.length === 1 ? 'lg:mx-auto lg:w-full lg:max-w-2xl' : ''
                  }`}
                >
                  {row.items.map((service) => (
                    <ServicePanel key={service.id} service={service} />
                  ))}
                </ul>
              ))}
            </div>
          </>
        )}
      </section>

      <ContactCta
        title="Cần tư vấn thiết bị hoặc hỗ trợ lắp đặt?"
        description="Mô tả nhu cầu và điều kiện thực tế của công trình, chúng tôi sẽ tư vấn sản phẩm và phương án thi công phù hợp."
      />
    </>
  )
}

import type { Metadata } from 'next'

import CoreValuePanels from '@/components/about/CoreValuePanels'
import VisionMissionTabs from '@/components/about/VisionMissionTabs'
import ContactCta from '@/components/common/ContactCta'
import ImageBanner, { type BannerImage } from '@/components/common/ImageBanner'
import { HighlightsList } from '@/components/home/Highlights'
import { coreValues } from '@/config/home'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Giới thiệu - ${siteConfig.shortName}`,
  description:
    'dodobanhang - tầm nhìn, sứ mệnh và giá trị cốt lõi.',
}

// Ảnh nền banner đầu trang: ảnh Hero trang chủ đã xoá nửa trái có chữ (public/images/banner-bg.png, 1440×520), chỉ còn hình cửa hàng bên phải.
// Ảnh có sẵn logo, slogan, 4 biểu tượng nên dưới lớp phủ tối sẽ thành họa tiết mờ phía sau chữ.
const bannerImage: BannerImage = {
  src: '/images/banner-bg.png',
  alt: `${siteConfig.shortName} - Mua sắm cùng dodo, đặt hàng ngay`,
  position: 'object-right',
}

// Tiêu đề section, cùng kiểu đầu trang (PageHeader) cho cả trang thống nhất: gạch đỏ ngắn phía
// trên, chữ in hoa đậm, căn trái; nhỏ hơn h1 đầu trang một cấp. Câu dẫn xám bên dưới (tùy chọn).
function SectionHeading({
  title,
  subtitle,
  className = '',
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={className}>
      <span className="mb-4 block h-1 w-16 bg-brand-primary" aria-hidden="true" />
      <h2 className="mb-0 text-2xl font-bold tracking-wide uppercase md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 mb-0 max-w-3xl text-neutral-600 md:text-lg">{subtitle}</p>}
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Đầu trang dạng banner ảnh nền (thay PageHeader nền xám + khung ảnh riêng trước đây, để 1 ảnh
          không xuất hiện 2 lần). 3 số liệu đè nhẹ lên mép dưới banner. */}
      <ImageBanner
        title="Giới thiệu"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]}
        image={bannerImage}
        overlapBottom
      />

      <section className="relative z-10 container -mt-14 md:-mt-20">
        <HighlightsList />
      </section>

      {/* >= lg 2 cột: tiêu đề + chữ giới thiệu bên trái (đoạn đầu to hơn làm đoạn dẫn), khung tab
          Tầm nhìn / Sứ mệnh bên phải ngang hàng với tiêu đề (dính khi cuộn vì cột chữ dài hơn).
          < lg xếp dọc. */}
      <section className="container py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="mx-auto max-w-3xl lg:mx-0">
            <SectionHeading title="Về chúng tôi" className="mb-8" />
            <div className="space-y-4 text-neutral-700 md:text-lg md:leading-8">
              <p className="text-lg text-neutral-900 md:text-xl md:leading-9">
                Công ty <strong>{siteConfig.shortName}</strong> là đơn vị chuyên cung cấp các vật
                dụng, thiết bị và máy móc phục vụ đa dạng ngành nghề và nhu cầu sản xuất, kinh doanh
                của khách hàng.
              </p>
              <p>
                Trong suốt quá trình hoạt động, {siteConfig.shortName} luôn chọn cách làm việc bằng
                sự tận tâm và đặt nhu cầu thực tế của khách hàng làm trọng tâm. Chúng tôi không quá
                chú trọng vào việc xuất hiện hay quảng bá rộng rãi, mà tập trung vào việc tìm kiếm
                những sản phẩm phù hợp, đảm bảo chất lượng và đồng hành cùng khách hàng trong từng
                nhu cầu cụ thể.
              </p>
              <p className="mb-0">
                Chính sự tin tưởng của khách hàng và những mối quan hệ được xây dựng qua thời gian
                là nền tảng để {siteConfig.shortName} từng bước phát triển. Sau một thời gian hoạt
                động bền bỉ, hôm nay chúng tôi mong muốn mở rộng thị trường, đưa những sản phẩm và
                giải pháp phù hợp đến với nhiều khách hàng hơn. Đây cũng là bước tiến mới để{' '}
                {siteConfig.shortName} được giới thiệu rõ hơn về những sản phẩm mình đang cung cấp,
                đồng thời tiếp tục xây dựng những mối quan hệ hợp tác lâu dài và đáng tin cậy.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl lg:sticky lg:top-24 lg:mx-0">
            <VisionMissionTabs />
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi: 1 hàng panel ngang, rê chuột vào panel nào thì panel đó mở ra (cùng kiểu
          ServicePanel ở /services); mobile xếp dọc, hiện đủ mô tả. Nền trắng như khối trên: ContactCta
          ngay sau không có padding trên, đặt nền xám ở đây thì khung đen dính sát mép xám. */}
      <section className="container py-12 md:py-16">
        <SectionHeading
          title="Giá trị cốt lõi"
          subtitle={`${coreValues.length} điều ${siteConfig.shortName} giữ vững trong suốt quá trình hoạt động và phục vụ khách hàng.`}
          className="mb-10"
        />
        <CoreValuePanels />
      </section>

      <ContactCta
        title="Muốn tìm hiểu thêm về sản phẩm của chúng tôi?"
        description="Liên hệ để được tư vấn sản phẩm và giải pháp phù hợp với nhu cầu của bạn."
      />
    </>
  )
}

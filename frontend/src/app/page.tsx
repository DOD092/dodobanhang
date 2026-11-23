import Link from 'next/link'

import CoreValues from '@/components/home/CoreValues'
import CustomerReviews from '@/components/home/CustomerReviews'
import CtaStrip from '@/components/home/CtaStrip'
import HeroBanner from '@/components/home/HeroBanner'
import Highlights from '@/components/home/Highlights'
import CategoryCard from '@/components/product/CategoryCard'
import ServiceCard from '@/components/service/ServiceCard'
import { siteConfig } from '@/config/site'
import { getCategories } from '@/features/category/categoryAPI'
import { getReviews } from '@/features/review/reviewAPI'
import { getServices } from '@/features/service/serviceAPI'

const HOME_SERVICE_LIMIT = 3 // số thẻ dịch vụ tối đa ở trang chủ; đầy đủ ở /services

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="mb-3 text-2xl font-bold tracking-wide uppercase md:text-3xl">{title}</h2>
      <span className="mx-auto block h-1 w-16 bg-brand-primary" aria-hidden="true" />
      {subtitle && <p className="mx-auto mt-4 mb-0 max-w-2xl text-neutral-600">{subtitle}</p>}
    </div>
  )
}

function MoreButton({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-8 text-center">
      <Link href={href} className="btn btn-outline-primary rounded-full px-6 py-2 font-semibold">
        {label}
      </Link>
    </div>
  )
}

// Server Component: lấy dữ liệu trực tiếp bằng async/await
export default async function HomePage() {
  const [categories, services, reviews] = await Promise.all([
    getCategories(),
    getServices(),
    getReviews(),
  ])

  return (
    <>
      <HeroBanner />
      {/* Ảnh bìa hiện tại không có dải trống ở đáy nên Highlights không đè lên ảnh */}
      <Highlights overlap={false} />

      <section className="container py-16">
        <SectionTitle
          title="Sản phẩm kinh doanh"
          subtitle="Cơ khí, vật liệu nhôm, thiết bị nông nghiệp, năng lượng mặt trời và đèn LED chiếu sáng."
        />
        {/* Nhóm sản phẩm (Category); danh sách sản phẩm cụ thể ở trang /products */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {/* Chỉ nhóm gốc có sản phẩm; nhóm con xem ở /products (cột "Khám phá theo danh mục") */}
          {categories
            .filter((category) => !category.parentId && category.productCount > 0)
            .map((category) => (
              <div key={category.id}>
                <CategoryCard category={category} />
              </div>
            ))}
        </div>
        <MoreButton href="/products" label="Xem tất cả sản phẩm" />
      </section>

      {/* Nền xám nhạt xen kẽ để tách với 2 section nền trắng trước/sau.
          Chưa có dịch vụ nào thì ẩn cả mục (không để tiêu đề + nút trống). */}
      {services.length > 0 && (
        <section className="bg-neutral-50 py-16">
          <div className="container">
            <SectionTitle title="Dịch vụ" subtitle={siteConfig.servicesIntro} />
            {/* Tối đa 3 thẻ/hàng; số cột = số thẻ đang hiện (<=3) nên không bao giờ có ô trống
                lệch trái khi chưa đủ 3 dịch vụ (khác `justify-content-center` của Bootstrap, ở đây
                không cần "căn giữa phần thừa" vì lưới luôn vừa khít số thẻ). */}
            {(() => {
              const shown = services.slice(0, HOME_SERVICE_LIMIT)
              const gridCols =
                shown.length === 1
                  ? 'md:grid-cols-1'
                  : shown.length === 2
                    ? 'md:grid-cols-2'
                    : 'md:grid-cols-3'
              return (
                <div
                  className={`mx-auto grid max-w-sm grid-cols-1 gap-4 md:max-w-none ${gridCols}`}
                >
                  {shown.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )
            })()}
            <MoreButton href="/services" label="Xem chi tiết dịch vụ" />
          </div>
        </section>
      )}

      <CtaStrip />

      <section className="container py-16">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CoreValues />
          <CustomerReviews reviews={reviews.slice(0, 3)} />
        </div>
      </section>
    </>
  )
}

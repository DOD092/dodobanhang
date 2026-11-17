import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ContactCta from '@/components/common/ContactCta'
import { PhoneCallIcon } from '@/components/common/Icons'
import PageHeader from '@/components/common/PageHeader'
import ServiceBody from '@/components/service/ServiceBody'
import ServiceCard from '@/components/service/ServiceCard'
import ServiceToc from '@/components/service/ServiceToc'
import { siteConfig } from '@/config/site'
import { getServiceById, getServices } from '@/features/service/serviceAPI'
import type { ContentBlock } from '@/types/ContentBlock'
import type { Service } from '@/types/Service'
import { slugParam, slugPath } from '@/utils/slug'
import { findBySlugParam, redirectToCanonical } from '@/utils/slugRoute'

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }> // dạng "lap-dat-camera-2" (slug + id ở cuối), xem utils/slug.ts
}

// Build sẵn HTML tĩnh cho mọi dịch vụ đang bật (SSG), mỗi dịch vụ một URL chuẩn `<slug>-<id>`.
// Id không tồn tại hoặc dịch vụ đã tắt thì 404; id đúng nhưng slug sai/cũ thì chuyển về URL chuẩn.
export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({ slug: slugParam(service) }))
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const service = await findBySlugParam((await params).slug, getServiceById)
  if (!service) return { title: `Không tìm thấy dịch vụ - ${siteConfig.shortName}` }

  return {
    title: `${service.name} - ${siteConfig.shortName}`,
    description: service.description,
    // Thêm `images` khi có ảnh thật + domain (cần metadataBase trong app/layout.tsx)
    openGraph: { title: service.name, description: service.description },
  }
}

// Thân bài: dùng `content` (khối JSON). Dịch vụ chưa có content thì tạm dựng từ `details`
// (các hạng mục ngắn) để trang không trống.
function getBlocks(service: Service): ContentBlock[] {
  if (service.content.length > 0) return service.content
  if (service.details.length === 0) return []
  return [
    { type: 'heading', level: 2, text: 'Hạng mục thực hiện' },
    { type: 'list', style: 'unordered', items: service.details },
  ]
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = await findBySlugParam(slug, getServiceById)
  if (!service) notFound()
  redirectToCanonical('/services', slug, service)

  const blocks = getBlocks(service)
  const others = (await getServices()).filter((item) => item.id !== service.id)

  return (
    <>
      <PageHeader
        title={service.name}
        subtitle={service.description}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Dịch vụ', href: '/services' },
          { label: service.name },
        ]}
      >
        <div className="mt-6">
          <Link href="/contact" className="btn btn-primary rounded-full px-6 py-2 font-semibold">
            Tư vấn ngay
          </Link>
        </div>
      </PageHeader>

      <section className="container py-10 md:py-16">
        {blocks.length > 0 ? (
          // Cột nội dung giới hạn 70ch (dòng chữ dài quá khó đọc) nên không chiếm hết chiều ngang;
          // cột phụ bên phải (mục lục + liên hệ nhanh, chỉ hiện >= lg) lấp chỗ trống đó thay vì để
          // trắng, và dính theo khi cuộn (`lg:sticky`) qua bài dài.
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="max-w-[70ch]">
              <ServiceBody blocks={blocks} />
            </div>
            <aside className="hidden lg:block">
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                <ServiceToc blocks={blocks} />
                <div className="rounded-2xl border-2 border-b-4 border-neutral-300 bg-white p-5 shadow-md">
                  <p className="mb-4 text-sm font-semibold text-neutral-900">Cần tư vấn nhanh?</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="btn btn-primary w-full justify-center rounded-full py-2 text-sm"
                    >
                      <PhoneCallIcon className="size-4" />
                      {siteConfig.phone}
                    </a>
                    {siteConfig.socials.zalo && (
                      <a
                        href={siteConfig.socials.zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary w-full justify-center rounded-full py-2 text-sm"
                      >
                        Chat Zalo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <p className="mb-0 max-w-[70ch] text-neutral-600 md:text-lg">
            Nội dung chi tiết đang được cập nhật. Vui lòng liên hệ để được tư vấn.
          </p>
        )}
      </section>

      {/* Không còn dịch vụ nào khác thì ẩn cả mục */}
      {others.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
          <div className="container">
            <h2 className="mb-6 text-xl font-bold tracking-wide uppercase md:text-2xl">
              Dịch vụ khác
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <div key={item.id}>
                  <ServiceCard
                    service={item}
                    href={slugPath('/services', item)}
                    linkLabel="Xem chi tiết"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-12 md:pt-16">
        <ContactCta
          title="Cần tư vấn dịch vụ này?"
          description="Mô tả nhu cầu và mặt bằng công trình, chúng tôi sẽ liên hệ tư vấn phương án phù hợp."
        />
      </div>
    </>
  )
}

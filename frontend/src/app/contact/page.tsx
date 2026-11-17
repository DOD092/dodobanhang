import type { Metadata } from 'next'

import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Liên hệ - ${siteConfig.shortName}`,
}

export default function ContactPage() {
  return (
    <>
      <ContactInfo />

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-8 lg:grid-cols-2">
          <div className="text-neutral-700 md:text-lg">
            <p>
              <strong className="text-neutral-900">{siteConfig.name}</strong> xin gửi lời cảm ơn
              chân thành tới quý khách hàng đã quan tâm đến các sản phẩm của chúng tôi.
            </p>
            <p>
              Quý khách hàng có nhu cầu tham khảo thông tin, báo giá sản phẩm hoặc cần tư vấn thêm,
              vui lòng liên hệ trực tiếp với chúng tôi.
            </p>
            <p>Hoặc để lại lời nhắn theo form liên hệ bên cạnh.</p>
            <p className="mb-0">Các sản phẩm được kinh doanh tại {siteConfig.shortName}.</p>
          </div>

          <div>
            <div className="rounded-3xl border-2 border-b-4 border-neutral-300 bg-white p-6 shadow-md md:p-8">
              <h2 className="mb-2 border-l-4 border-brand-primary pl-3 text-2xl font-bold">
                Liên hệ tư vấn
              </h2>
              <p className="mb-5 text-sm text-neutral-600">
                Vui lòng hoàn tất biểu mẫu bên dưới để gửi thông tin liên hệ cho chúng tôi.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

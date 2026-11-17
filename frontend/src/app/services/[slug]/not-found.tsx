import Link from 'next/link'

import { FactoryIcon } from '@/components/common/Icons'

// Hiện khi notFound() được gọi trong /services/[slug] (id không tồn tại hoặc dịch vụ đã tắt)
export default function ServiceNotFound() {
  return (
    <div className="container py-16 text-center md:py-24">
      <span className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
        <FactoryIcon className="size-10" />
      </span>
      <h1 className="mb-3 text-2xl font-bold md:text-3xl">Không tìm thấy dịch vụ</h1>
      <p className="mx-auto mb-6 max-w-md text-neutral-600">
        Dịch vụ có thể đã ngừng cung cấp hoặc đường dẫn không đúng.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/services" className="btn btn-primary rounded-full px-6 py-2 font-semibold">
          Xem tất cả dịch vụ
        </Link>
        <Link
          href="/contact"
          className="btn btn-outline-primary rounded-full px-6 py-2 font-semibold"
        >
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  )
}

import Link from 'next/link'

import { PackageIcon } from '@/components/common/Icons'

// Hiện khi notFound() được gọi trong /products/[slug] (id không tồn tại)
export default function ProductNotFound() {
  return (
    <div className="container py-16 text-center md:py-24">
      <span className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
        <PackageIcon className="size-10" />
      </span>
      <h1 className="mb-3 text-2xl font-bold md:text-3xl">Không tìm thấy sản phẩm</h1>
      <p className="mx-auto mb-6 max-w-md text-neutral-600">
        Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn btn-primary rounded-full px-6 py-2 font-semibold">
          Xem tất cả sản phẩm
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

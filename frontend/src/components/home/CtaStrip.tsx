import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/config/site'

/*
  Dải banner kêu gọi mua hàng (public/images/cta-strip.png, 1440×180), cả dải là 1 link tới
  /products (nút "Mua ngay" vẽ sẵn trong ảnh). Chỉ hiện từ md (768px): hẹp hơn thì dải chỉ
  cao < 96px, chữ trong ảnh quá nhỏ để đọc; trên điện thoại Hero vuông đã có nút này.
*/
export default function CtaStrip() {
  return (
    <section aria-label="Mua sắm cùng dodo" className="container hidden pt-4 md:block">
      <Link
        href="/products"
        className="block overflow-hidden rounded-3xl shadow-md transition-shadow outline-offset-4 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-brand-primary"
      >
        <Image
          src="/images/cta-strip.png"
          width={1440}
          height={180}
          sizes="(min-width: 1280px) 1232px, 100vw"
          alt={`${siteConfig.shortName} - Mua sắm cùng dodo. Đặt hàng ngay. Mua ngay`}
          className="block h-auto w-full"
        />
      </Link>
    </section>
  )
}

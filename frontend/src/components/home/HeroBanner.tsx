import { getImageProps } from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/config/site'

/*
  Ảnh bìa trang chủ (bản "Mua sắm cùng dodo", 19/11/2026), đổi ảnh theo bề rộng màn hình (art direction, `<picture>`):
  - < 640px: `hero-square.png` (640×640, chữ to, đọc được trên điện thoại)
  - >= 640px: `hero.png` (1440×520)
  Logo, slogan và nút đều VẼ SẴN trong ảnh nên hiện trọn ảnh, không cắt. Nút trong ảnh không bấm được
  -> phủ link trong suốt đúng vị trí nút (tọa độ % đo trên ảnh gốc, xem HOTSPOTS). Đổi ảnh khác thì
  đo lại tọa độ + sửa width/height cho đúng ảnh thật.
  /about, /services, /products, /contact dùng `banner-bg.png` (= hero.png đã xoá nửa trái có chữ) làm nền.
*/
const ALT = `${siteConfig.shortName} - Mua sắm cùng dodo. Đặt hàng ngay. Chọn sản phẩm, đặt hàng online và nhận tại nhà.`

// left/top/width/height theo % kích thước ảnh. `sm` = ảnh ngang (>= 640px), `base` = ảnh vuông.
const HOTSPOTS = [
  {
    href: '/products',
    label: 'Mua ngay',
    base: 'left-[7.7%] top-[83.1%] w-[23.1%] h-[8%]',
    sm: 'sm:left-[5%] sm:top-[78.8%] sm:w-[11.5%] sm:h-[10.2%]',
  },
  {
    href: '/products',
    label: 'Xem sản phẩm',
    base: 'hidden', // ảnh vuông không có nút này
    sm: 'sm:block sm:left-[17.7%] sm:top-[78.8%] sm:w-[12.3%] sm:h-[10.2%]',
  },
]

export default function HeroBanner() {
  const common = {
    alt: ALT,
    sizes: '100vw',
    loading: 'eager' as const,
    fetchPriority: 'high' as const,
  }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: '/images/hero.png', width: 1440, height: 520 })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: '/images/hero-square.png', width: 640, height: 640 })

  return (
    <section aria-label="Banner" className="relative bg-brand-primary">
      {/* Chữ trong ảnh không đọc được với trình đọc màn hình / SEO, nên giữ h1 ẩn */}
      <h1 className="sr-only">{siteConfig.name} - Mua sắm cùng dodo. Đặt hàng ngay.</h1>
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        <source srcSet={mobile} />
        {/* alt, width, height, src nằm trong `rest` (của ảnh vuông, fallback) */}
        <img {...rest} className="block h-auto w-full" />
      </picture>
      {HOTSPOTS.map((spot) => (
        <Link
          key={spot.label}
          href={spot.href}
          aria-label={spot.label}
          className={`absolute rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand-accent ${spot.base} ${spot.sm}`}
        />
      ))}
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/config/site'

// Logo header: biểu tượng SVG vuông nền xanh (public/images/logo.svg) + tên thương hiệu.
// SVG có nền riêng nên dùng được cả trên nền trắng lẫn nền tối (Footer dùng lại cùng file).
// next/image không tối ưu SVG (trả nguyên file) nên không cần dangerouslyAllowSVG.
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} - Trang chủ`}
      className="flex shrink-0 items-center gap-2 text-inherit no-underline"
    >
      <Image
        src="/images/logo.svg"
        alt=""
        width={40}
        height={40}
        loading="eager" // luôn ở màn hình đầu; không dùng preload vì logo không phải ảnh LCP
        className="h-10 w-auto shrink-0"
      />
      {/* Logo + chữ + 3 nút bên phải chỉ vừa 1 hàng từ ~440px; hẹp hơn thì ẩn chữ (logo vẫn đủ
          nhận diện), nếu không header vỡ xuống 2 hàng */}
      <span className="hidden text-base font-bold whitespace-nowrap text-neutral-900 min-[440px]:inline sm:text-xl">
        {siteConfig.shortName}
      </span>
    </Link>
  )
}

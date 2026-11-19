import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/config/site'

// Logo header: con dodo nền trong suốt (public/images/brand/dodo-mark.png, 206×194, cắt từ bộ nhận
// diện frontend/design/logo-dodo-brand-sheet.png) + chữ "dodo" (xanh) "banhang" (đỏ gạch #B3361A) đúng màu logo gốc.
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} - Trang chủ`}
      className="flex shrink-0 items-center gap-2 text-inherit no-underline"
    >
      <Image
        src="/images/brand/dodo-mark.png"
        alt=""
        width={42}
        height={40}
        loading="eager" // luôn ở màn hình đầu; không dùng preload vì logo không phải ảnh LCP
        className="h-10 w-auto shrink-0"
      />
      {/* Logo + chữ + 3 nút bên phải chỉ vừa 1 hàng từ ~440px; hẹp hơn thì ẩn chữ (logo vẫn đủ
          nhận diện), nếu không header vỡ xuống 2 hàng */}
      <span className="hidden text-lg font-extrabold tracking-tight whitespace-nowrap min-[440px]:inline sm:text-2xl">
        <span className="text-brand-primary">dodo</span>
        <span className="text-[#b3361a]">banhang</span>
      </span>
    </Link>
  )
}

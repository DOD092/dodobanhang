import Image from 'next/image'

import { siteConfig } from '@/config/site'

// Ảnh bìa trang chủ do chủ dự án thiết kế (1360×540, file gốc "bìa web (1).png"), đã có sẵn logo,
// slogan và 4 biểu tượng ở cột trái, nên hiện trọn ảnh (không cắt, không đè chữ hay Highlights lên;
// đáy ảnh không có dải trống nên Highlights nằm ngay dưới, không đè). Ảnh tràn hết bề ngang màn hình
// (chủ dự án yêu cầu), chiều cao theo tỉ lệ ảnh. Ảnh chỉ rộng 1360px nên màn hình rộng hơn sẽ hơi
// mờ. Thay ảnh khác thì sửa width/height cho đúng tỉ lệ thật. /about, /services, /products,
// /contact cũng dùng ảnh này làm nền banner (dưới lớp phủ tối).
const heroImage = {
  src: '/images/home-banner.png',
  width: 1360,
  height: 540,
}

export default function HeroBanner() {
  return (
    <section aria-label="Banner">
      {/* Chữ trong ảnh không đọc được với trình đọc màn hình / SEO, nên giữ h1 ẩn là tên công ty */}
      <h1 className="sr-only">{siteConfig.name}</h1>
      <Image
        src={heroImage.src}
        width={heroImage.width}
        height={heroImage.height}
        alt={`${siteConfig.shortName} - Thiết bị công nghiệp, chất lượng tạo nên niềm tin: sản phẩm chính hãng, giao hàng nhanh chóng, tư vấn tận tâm, đồng hành lâu dài`}
        preload
        sizes="100vw"
        className="block h-auto w-full"
      />
    </section>
  )
}

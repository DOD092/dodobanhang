import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

import {
  ArrowRightIcon,
  DroneIcon,
  GearIcon,
  LayersIcon,
  LightbulbIcon,
  SunIcon,
} from '@/components/common/Icons'
import { buildProductsHref, defaultProductQuery } from '@/features/product/productQuery'
import type { Category } from '@/types/Category'

// Category không có field icon nên gán icon theo slug (id là uuid, khác nhau giữa các DB);
// slug khác dùng icon mặc định. Thêm/đổi nhóm sản phẩm trong DB thì cập nhật map này
// (slug ban đầu: backend/src/database/catalog-seed/catalog.seed-data.ts).
const categoryIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'co-khi-phu-kien': GearIcon,
  'vat-lieu-nhom': LayersIcon, // tấm phẳng xếp lớp
  'thiet-bi-nong-nghiep': DroneIcon,
  'nang-luong-mat-troi': SunIcon,
  'den-led-chieu-sang': LightbulbIcon,
}

// Thẻ nhóm sản phẩm: icon đỏ trên nền đỏ nhạt (khác thẻ dịch vụ nền đỏ đặc).
// Cả thẻ dẫn tới /products?category=<slug> (trang sản phẩm lọc sẵn theo nhóm).
export default function CategoryCard({ category }: { category: Category }) {
  const Icon = categoryIcons[category.slug] ?? GearIcon

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border-2 border-b-4 border-neutral-300 bg-white p-[1rem] shadow-md sm:p-6 transition hover:-translate-y-1 hover:border-b-brand-primary hover:shadow-xl">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-primary-light text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
        <Icon className="size-7" />
      </span>
      <h3 className="mb-2 text-lg font-bold">{category.name}</h3>
      <p className="mb-4 grow text-sm text-neutral-600">{category.description}</p>
      {/* after:absolute after:inset-0 phủ link lên cả thẻ */}
      <Link
        href={buildProductsHref(defaultProductQuery, { category: category.slug })}
        aria-label={`Xem sản phẩm ${category.name}`}
        className="inline-flex items-center gap-x-1 text-sm font-semibold text-brand-primary no-underline after:absolute after:inset-0"
      >
        Xem sản phẩm
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  )
}

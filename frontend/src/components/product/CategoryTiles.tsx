import Image from 'next/image'
import Link from 'next/link'

import { buildProductsHref, type ProductQuery } from '@/features/product/productQuery'
import type { CategoryNode } from '@/types/Category'
import { resolveImageUrl } from '@/utils/imageUrl'

/*
  Hàng ô "Khám phá theo danh mục" ở đầu trang /products: nhóm con của nhóm đang xem (chưa chọn nhóm
  thì là các nhóm gốc). Cuộn ngang trên mobile. Nhóm chưa có ảnh -> ô chữ cái đầu.
*/
export default function CategoryTiles({
  categories,
  query,
}: {
  categories: CategoryNode[]
  query: ProductQuery
}) {
  const shown = categories.filter((category) => category.productCount > 0)
  if (shown.length === 0) return null

  return (
    <section className="rounded-xl bg-white p-4 md:p-5">
      <h2 className="mb-4 text-base font-bold md:text-lg">Khám phá theo danh mục</h2>
      <ul className="m-0 flex list-none snap-x gap-3 overflow-x-auto p-0 pb-1">
        {shown.map((category) => (
          <li key={category.id} className="w-28 shrink-0 snap-start sm:w-32">
            <Link
              href={buildProductsHref(query, { category: category.slug })}
              scroll={false}
              className="group block text-center text-inherit no-underline"
            >
              <span className="relative mx-auto mb-2 block aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
                {category.imageUrl ? (
                  <Image
                    src={resolveImageUrl(category.imageUrl)}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain p-2 transition-transform group-hover:scale-105"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-3xl font-bold text-brand-primary">
                    {category.name.charAt(0)}
                  </span>
                )}
              </span>
              <span className="line-clamp-2 text-sm leading-snug text-neutral-800 group-hover:text-brand-primary">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

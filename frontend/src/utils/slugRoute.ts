import { permanentRedirect } from 'next/navigation'

import { parseSlugId, slugParam, slugPath, type Sluggable } from './slug'

/*
  Phần dùng chung cho trang chi tiết dạng /<mục>/<slug>-<id> (chỉ dùng trong Server Component).
  Cách dùng trong app/<mục>/[slug]/page.tsx:
    generateStaticParams: mục.map((item) => ({ slug: slugParam(item) }))
    generateMetadata:     const item = await findBySlugParam(slug, getXxxById)
    Page:                 const item = await findBySlugParam(slug, getXxxById)
                          if (!item) notFound()
                          redirectToCanonical('/mục', slug, item)
*/

// Tìm mục theo tham số URL (chỉ dùng phần id). Tham số không hợp lệ hoặc không có mục thì undefined.
export async function findBySlugParam<T extends Sluggable>(
  param: string,
  findById: (id: number) => Promise<T | undefined>
): Promise<T | undefined> {
  const id = parseSlugId(param)
  return id === undefined ? undefined : findById(id)
}

// Vào bằng URL không chuẩn (chỉ có id, slug cũ sau khi đổi tên, viết hoa...) thì chuyển hướng vĩnh
// viễn (308) về URL chuẩn, để mỗi trang chỉ có một địa chỉ chính thức. Không gọi trong generateMetadata.
export function redirectToCanonical(basePath: string, param: string, item: Sluggable): void {
  if (param !== slugParam(item)) permanentRedirect(slugPath(basePath, item))
}

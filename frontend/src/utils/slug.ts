import { normalizeText } from './normalizeText'

/*
  URL trang chi tiết: `<slug>-<id>`, id đặt CUỐI, ví dụ /services/lap-dat-camera-2.
  - Trang tìm bằng id (phần số sau dấu '-' cuối cùng); phần chữ chỉ để đọc và cho SEO, tự sinh từ
    `name` nên không có trường dữ liệu nào phải viết tay hay giữ cho không trùng.
  - Đổi tên thì URL cũ vẫn mở được (tìm bằng id) và được chuyển hướng về URL chuẩn (slugRoute.ts).
  Mọi loại trang chi tiết đều phải tạo/đọc URL qua file này, không tự ghép chuỗi `/xxx/${id}`.

  Ngoại lệ - dữ liệu lấy từ backend (sản phẩm): DB có cột `slug` UNIQUE và khoá chính là uuid, nên
  URL chỉ là `/products/<slug>` (không kèm id) và tìm bằng slug. Dùng `productPath()` bên dưới.
  Kiểu `<slug>-<id>` chỉ còn dùng cho dữ liệu hardcode có id số (dịch vụ).
*/

export const PRODUCTS_BASE_PATH = '/products'

// URL trang chi tiết sản phẩm: productPath(product) -> "/products/vong-bi-nsk-684zz"
export function productPath(product: { slug: string }): string {
  return `${PRODUCTS_BASE_PATH}/${encodeURIComponent(product.slug)}`
}

export interface Sluggable {
  id: number
  name: string
}

const MAX_SLUG_LENGTH = 80

// "Lắp đặt camera" -> "lap-dat-camera". Tên dài thì cắt ở ranh giới từ để không bị đứt giữa chữ.
export function toSlug(text: string, maxLength = MAX_SLUG_LENGTH): string {
  const slug = normalizeText(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (slug.length <= maxLength) return slug
  if (slug[maxLength] === '-') return slug.slice(0, maxLength)

  const cut = slug.slice(0, maxLength)
  const lastDash = cut.lastIndexOf('-')
  return lastDash > 0 ? cut.slice(0, lastDash) : cut
}

// Phần cuối của URL: "lap-dat-camera-2". Tên không tạo được slug (rỗng, toàn ký tự lạ) thì chỉ còn "2".
export function slugParam(item: Sluggable): string {
  const slug = toSlug(item.name)
  return slug ? `${slug}-${item.id}` : String(item.id)
}

// URL chuẩn đầy đủ: slugPath('/services', item) -> "/services/lap-dat-camera-2"
export function slugPath(basePath: string, item: Sluggable): string {
  return `${basePath}/${slugParam(item)}`
}

// Lấy id từ phần cuối của URL: "lap-dat-camera-2" -> 2, "2" -> 2; "abc", "1.5", "lap-dat-camera" -> undefined
export function parseSlugId(param: string): number | undefined {
  const match = /(?:^|-)(\d+)$/.exec(param)
  if (!match) return undefined
  const id = Number(match[1])
  return Number.isSafeInteger(id) ? id : undefined
}

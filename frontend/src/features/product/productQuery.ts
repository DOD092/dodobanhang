// Bộ lọc trang /products lưu trên URL (?q=&category=&price=&sort=&page=) để chia sẻ link,
// bấm Back/Forward vẫn giữ bộ lọc, và Server Component đọc được qua `searchParams`.
// File thuần (không dùng API server/client) nên dùng được ở cả hai phía.

export const PRODUCTS_PATH = '/products'
export const PRODUCTS_PAGE_SIZE = 9

export const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'name-asc', label: 'Tên A-Z' },
] as const

export type SortValue = (typeof sortOptions)[number]['value']

// max không tính (giá < max); undefined = không giới hạn
export const priceRanges = [
  { value: 'under-100k', label: 'Dưới 100.000đ', max: 100_000 },
  { value: '100k-500k', label: '100.000đ - 500.000đ', min: 100_000, max: 500_000 },
  { value: '500k-1m', label: '500.000đ - 1 triệu', min: 500_000, max: 1_000_000 },
  { value: 'over-1m', label: 'Trên 1 triệu', min: 1_000_000 },
] as const satisfies readonly { value: string; label: string; min?: number; max?: number }[]

export type PriceRangeValue = (typeof priceRanges)[number]['value']

export interface ProductQuery {
  q: string
  category: string | null // slug của nhóm (vd 'den-led-chieu-sang')
  price: PriceRangeValue | null
  sort: SortValue
  page: number
}

export const defaultProductQuery: ProductQuery = {
  q: '',
  category: null,
  price: null,
  sort: 'newest',
  page: 1,
}

type RawSearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? ''
}

// Slug do backend sinh (chữ thường không dấu, số, gạch ngang); giá trị khác coi như không lọc
function slugValue(value: string): string | null {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 150 ? value : null
}

function positiveInt(value: string): number | null {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : null
}

// Giá trị lạ trên URL (sửa tay, link cũ) được bỏ qua thay vì báo lỗi
export function parseProductQuery(searchParams: RawSearchParams): ProductQuery {
  const sort = first(searchParams.sort)
  const price = first(searchParams.price)

  return {
    q: first(searchParams.q).slice(0, 100),
    category: slugValue(first(searchParams.category)),
    price: priceRanges.find((range) => range.value === price)?.value ?? null,
    sort: sortOptions.find((option) => option.value === sort)?.value ?? defaultProductQuery.sort,
    page: positiveInt(first(searchParams.page)) ?? 1,
  }
}

// Tạo link /products với bộ lọc mới. Đổi bộ lọc thì về trang 1 (trừ khi truyền `page`).
// Giá trị mặc định không ghi lên URL cho gọn.
export function buildProductsHref(query: ProductQuery, changes: Partial<ProductQuery> = {}) {
  const next: ProductQuery = { ...query, page: 1, ...changes }
  const params = new URLSearchParams()

  if (next.q) params.set('q', next.q)
  if (next.category !== null) params.set('category', next.category)
  if (next.price) params.set('price', next.price)
  if (next.sort !== defaultProductQuery.sort) params.set('sort', next.sort)
  if (next.page > 1) params.set('page', String(next.page))

  const search = params.toString()
  return search ? `${PRODUCTS_PATH}?${search}` : PRODUCTS_PATH
}

export function hasActiveFilters(query: ProductQuery) {
  return Boolean(query.q || query.category !== null || query.price)
}

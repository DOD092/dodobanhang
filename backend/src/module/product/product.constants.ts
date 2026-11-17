// Trạng thái được hiển thị trên web bán hàng. ERD không quy định giá trị cho
// products.status / categories.status nên tạm thống nhất: 'ACTIVE' = hiện,
// mọi giá trị khác (DRAFT, HIDDEN...) = ẩn khỏi các endpoint công khai.
export const PUBLIC_STATUS = 'ACTIVE';

export const PRODUCT_SORTS = [
  'newest',
  'price-asc',
  'price-desc',
  'name-asc',
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const SEARCH_MAX_LIMIT = 100;

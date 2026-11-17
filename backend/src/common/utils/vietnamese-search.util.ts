/**
 * Tìm kiếm tiếng Việt không phân biệt dấu/hoa thường mà KHÔNG cần extension
 * `unaccent` (phải CREATE EXTENSION trên DB dùng chung): dùng hàm `translate()`
 * có sẵn của Postgres, map từng ký tự có dấu (cả hoa lẫn thường) về chữ thường
 * không dấu, rồi `lower()` phần ASCII còn lại.
 *
 * Phía JS dùng `normalizeVietnamese()` cho từ khoá, phía SQL dùng
 * `unaccentSql()` cho cột -> hai bên ra cùng một dạng để so `LIKE`.
 */

const LOWER_ACCENTED =
  'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';

export function normalizeVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

const FROM_CHARS = (LOWER_ACCENTED + LOWER_ACCENTED.toUpperCase()).normalize(
  'NFC',
);
const TO_CHARS = Array.from(FROM_CHARS, (ch) => normalizeVietnamese(ch)).join(
  '',
);

if (Array.from(FROM_CHARS).length !== Array.from(TO_CHARS).length) {
  // Bảo vệ khi ai đó sửa LOWER_ACCENTED: translate() cần 2 chuỗi dài bằng nhau
  throw new Error('vietnamese-search: bảng ký tự translate() bị lệch');
}

/** Tham số cần truyền kèm query khi dùng `unaccentSql()`. */
export const UNACCENT_PARAMS = {
  unaccentFrom: FROM_CHARS,
  unaccentTo: TO_CHARS,
};

/** Bọc biểu thức SQL: `unaccentSql('product.name')`. Nhớ `setParameters(UNACCENT_PARAMS)`. */
export function unaccentSql(expression: string): string {
  return `lower(translate(${expression}, :unaccentFrom, :unaccentTo))`;
}

/** Escape ký tự đặc biệt của LIKE (`%`, `_`, `\`) trong từ khoá người dùng nhập. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/** "Đèn  LED" -> ['den', 'led'] */
export function toKeywords(query: string | undefined): string[] {
  return normalizeVietnamese(query ?? '')
    .split(/\s+/)
    .filter(Boolean);
}

const MAX_SLUG_LENGTH = 80;

/**
 * "Vòng bi NSK 684ZZ" -> "vong-bi-nsk-684zz". Giống hệt `toSlug()` của frontend
 * (frontend/src/utils/slug.ts): tối đa 80 ký tự, cắt ở ranh giới từ.
 */
export function toSlug(text: string, maxLength = MAX_SLUG_LENGTH): string {
  const slug = normalizeVietnamese(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length <= maxLength) return slug;
  if (slug[maxLength] === '-') return slug.slice(0, maxLength);

  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf('-');
  return lastDash > 0 ? cut.slice(0, lastDash) : cut;
}

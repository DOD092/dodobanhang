// Bỏ dấu tiếng Việt + chữ thường để tìm kiếm: "Thép" khớp "thep", "Đỏ" khớp "do"
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

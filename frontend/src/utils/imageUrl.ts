import { API_ORIGIN } from '@/apis/client'

// Ảnh trả về từ backend có 2 loại:
// - '/images/...': ảnh tĩnh trong frontend/public (dữ liệu seed) -> dùng nguyên
// - '/uploads/...': file backend lưu (useStaticAssets ở backend/src/main.ts) -> ghép origin backend
// URL tuyệt đối (http...) giữ nguyên (cần khai báo trong images.remotePatterns của next.config.ts).
export function resolveImageUrl(url: string): string {
  return url.startsWith('/uploads/') ? `${API_ORIGIN}${url}` : url
}

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

// Danh sách ảnh để hiển thị, luôn có ít nhất 1 ảnh (sản phẩm chưa có ảnh thì dùng ảnh giữ chỗ)
export function productImages(images: string[]): string[] {
  return images.length > 0 ? images.map(resolveImageUrl) : [PLACEHOLDER_IMAGE]
}

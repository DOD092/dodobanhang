import { connection } from 'next/server'

import { ApiError, apiRequest, buildApiUrl } from './client'

/*
  GET dữ liệu từ backend trong Server Component (chỉ import ở features/<domain>/xxxAPI.ts).

  `connection()`: trang gọi hàm này luôn render theo từng request (không prerender lúc build), vì:
  - `npm run build` không cần backend đang chạy;
  - sản phẩm/nhóm sửa trong DB hiện ngay, không phải build lại.
  Khi cần tối ưu tốc độ có thể chuyển sang cache có thời hạn (`next: { revalidate }`).
*/
export async function serverGet<T>(
  path: string,
  params?: Record<string, string | number | null | undefined>
): Promise<T> {
  await connection()
  return apiRequest<T>(buildApiUrl(path, params), { cache: 'no-store' })
}

// Như serverGet nhưng 404 thì trả undefined (cho trang chi tiết gọi notFound())
export async function serverGetOrUndefined<T>(
  path: string,
  params?: Record<string, string | number | null | undefined>
): Promise<T | undefined> {
  try {
    return await serverGet<T>(path, params)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined
    throw error
  }
}

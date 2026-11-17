/*
  Gọi backend NestJS (backend/). Mọi response thành công của backend đều bọc dạng
  { data, isSuccess, message, statusCode, timestamp } (TransformResponseInterceptor) -> hàm ở đây
  bóc `data` ra để các file features/<domain>/xxxAPI.ts nhận thẳng dữ liệu.

  File thuần (không import next/server) nên dùng được cả ở Server Component lẫn Client Component.
  Server Component thì gọi qua `serverGet()` (apis/server.ts) để trang luôn render theo request.
*/

// Phải có tiền tố NEXT_PUBLIC_ vì form liên hệ gọi từ trình duyệt. Xem frontend/.env.example.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api').replace(
  /\/+$/,
  ''
)

// Origin của backend (bỏ /api), để ghép đường dẫn ảnh /uploads/... (xem utils/imageUrl.ts)
export const API_ORIGIN = new URL(API_URL).origin

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface Envelope<T> {
  data: T
  isSuccess: boolean
  message: string | string[]
  statusCode: number
}

type QueryValue = string | number | null | undefined

export function buildApiUrl(path: string, params: Record<string, QueryValue> = {}): string {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '')
      url.searchParams.set(key, String(value))
  }
  return url.toString()
}

export async function apiRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init.headers },
  })

  // 204 No Content: backend không bọc envelope
  if (response.status === 204) return undefined as T

  const body = (await response.json().catch(() => null)) as Envelope<T> | null
  if (!response.ok || !body || body.isSuccess === false) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new ApiError(response.status, message || `Lỗi gọi API (${response.status})`)
  }
  return body.data
}

export function apiPost<T>(path: string, payload: unknown): Promise<T> {
  return apiRequest<T>(buildApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

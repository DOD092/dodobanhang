// Chỉ cho phép chuyển hướng tới đường dẫn NỘI BỘ của site (vd '/products/abc').
// Chặn '//evil.com', 'https://...', '/\evil.com' (trình duyệt hiểu '\' như '/') để ?next= trên URL
// không thành lỗ hổng open redirect (lừa người dùng đăng nhập xong bị đưa sang trang lạ).
export function safeRedirect(next: string | undefined | null, fallback = '/account'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback
  }
  return next.slice(0, 500)
}

import type { NextConfig } from 'next'

// Ảnh backend lưu (/uploads/...) được tải qua next/image từ origin của API.
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
        pathname: '/uploads/**',
      },
      // Ảnh sản phẩm giả lập crawl từ Tiki (backend SEED_TIKI, backend.md mục 7.7): URL tuyệt đối
      // trên CDN của Tiki. Chỉ dùng cho dữ liệu test; bỏ khi không còn sản phẩm Tiki trong DB.
      { protocol: 'https', hostname: 'salt.tikicdn.com', pathname: '/**' },
    ],
    // Khi dev, backend ở localhost: bộ tối ưu ảnh của Next 16 mặc định chặn IP nội bộ (chống SSRF).
    // Chỉ mở ở development; production thì backend phải có domain/IP công khai.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
}

export default nextConfig

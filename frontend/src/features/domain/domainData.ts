import type { Domain } from '@/types/Domain'

// Nhóm sản phẩm kinh doanh, theo ngành nghề đăng ký (4662, 4663, 4752).
// Icon trên trang chủ gán theo id trong CategoryCard.
export const domains: Domain[] = [
  { id: 1, name: 'Thép xây dựng', description: 'Sắt, thép xây dựng các loại.' },
  {
    id: 2,
    name: 'Thép tấm, thép hình',
    description: 'Thép tấm, thép hình dùng cho xây dựng và công nghiệp.',
  },
  { id: 3, name: 'Nhôm', description: 'Nhôm các loại.' },
  { id: 4, name: 'Inox', description: 'Inox các loại.' },
  { id: 5, name: 'Sơn', description: 'Sơn các loại.' },
  {
    id: 6,
    name: 'Vật liệu xây dựng & nội thất',
    description: 'Vật liệu xây dựng, vật liệu trang trí nội thất.',
  },
]

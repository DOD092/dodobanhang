import type { ContentBlock } from './ContentBlock'

export interface Service {
  id: number
  name: string
  description: string
  image_url: string
  details: string[] // các hạng mục chi tiết, hiện ở trang /services (tự thêm, chưa có trong schema gốc)
  content: ContentBlock[] // thân bài trang chi tiết, dạng khối JSON; [] nếu chưa có (tự thêm)
  sort_order: number // thứ tự hiển thị, số nhỏ hiện trước (tự thêm)
  is_active: boolean // false: ẩn khỏi web nhưng vẫn giữ dữ liệu (tự thêm)
}

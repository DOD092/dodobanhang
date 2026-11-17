export interface Review {
  id: number
  content: string
  images: string[] // ảnh thực tế kèm đánh giá (vd hàng đã giao), [] nếu không có
  // Không có thì không hiện / hiện nhãn chung (không tự đặt tên, chấm sao hay ghi ngày thay khách)
  customer_name?: string
  rating?: number // 1-5 sao
  created_at?: string // ngày đánh giá, ISO 8601 (vd '2026-09-09T08:42:00+07:00')
}

import type { Review } from '@/types/Review'

// Đánh giá thật của khách hàng do chủ dự án gửi: nội dung + ảnh hàng đã giao. Chưa có tên khách
// hàng, số sao, ngày đánh giá nên để trống (component tự ẩn / hiện nhãn chung), không tự điền.
export const reviews: Review[] = [
  {
    id: 1,
    content: 'Nhân viên tư vấn nhiệt tình, hóa đơn chứng từ đầy đủ, sẽ hợp tác lâu dài.',
    images: ['/images/feedbacks/feedback-1.jpg'],
  },
  {
    id: 2,
    content:
      'Hỗ trợ khách hàng nhanh chóng, giúp đưa ra những lựa chọn hay, phù hợp với không gian.',
    images: ['/images/feedbacks/feedback-2.jpg'],
  },
  {
    id: 3,
    content: 'Giao hàng nhanh chóng, lần đầu tiên hợp tác và sẽ quay trở lại.',
    images: ['/images/feedbacks/feedback-3.jpg'],
  },
]

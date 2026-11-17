// Nội dung tĩnh của trang chủ và trang Giới thiệu (không phải entity nên không đặt trong features/)

export interface Highlight {
  icon: 'order' | 'experience' | 'shipping'
  value: string
  label: string
}

export interface CoreValue {
  icon: 'dedication' | 'trust' | 'quality' | 'companion' | 'growth'
  title: string
  description: string
}

export const highlights: Highlight[] = [
  { icon: 'order', value: '+1000', label: 'đơn hàng / 3 tháng' },
  { icon: 'experience', value: '+10', label: 'năm kinh nghiệm' },
  { icon: 'shipping', value: 'Toàn quốc', label: 'vận chuyển cả nước' },
]

// Giá trị cốt lõi thật, do chủ dự án cung cấp. Icon gán theo `icon` trong CoreValues.tsx
// (trang chủ) và app/about/page.tsx (trang Giới thiệu) - đổi thứ tự/nội dung thì 2 nơi tự cập nhật.
export const coreValues: CoreValue[] = [
  {
    icon: 'dedication',
    title: 'Tận tâm',
    description:
      'Luôn lắng nghe và đặt nhu cầu thực tế của khách hàng làm trọng tâm trong mỗi sản phẩm và dịch vụ cung cấp.',
  },
  {
    icon: 'trust',
    title: 'Uy tín',
    description:
      'Giữ đúng những gì đã cam kết, minh bạch trong quá trình làm việc và trân trọng niềm tin mà khách hàng dành cho dodobanhang.',
  },
  {
    icon: 'quality',
    title: 'Chất lượng',
    description:
      'Không ngừng tìm kiếm và lựa chọn những sản phẩm đáp ứng yêu cầu về chất lượng, công năng và tính phù hợp với nhu cầu sử dụng.',
  },
  {
    icon: 'companion',
    title: 'Đồng hành',
    description:
      'Không chỉ cung cấp sản phẩm, chúng tôi mong muốn đồng hành cùng khách hàng trong quá trình lựa chọn và sử dụng, hướng đến những mối quan hệ hợp tác lâu dài.',
  },
  {
    icon: 'growth',
    title: 'Phát triển',
    description:
      'Chủ động mở rộng thị trường, cập nhật những sản phẩm và thiết bị mới, đồng thời không ngừng hoàn thiện để đáp ứng tốt hơn nhu cầu ngày càng đa dạng của khách hàng.',
  },
]

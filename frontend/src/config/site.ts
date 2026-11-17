export interface NavItem {
  label: string
  href: string
}

export const siteConfig = {
  name: 'dodobanhang',
  companyType: 'CÔNG TY TNHH TM&DV', // loại hình, ghép với shortName thành tên đầy đủ (dùng ở Hero)
  shortName: 'dodobanhang', // tên thương hiệu: cạnh logo trên header, chữ lớn ở Hero
  tagline: 'Sắt thép, nhôm, inox & vật liệu xây dựng', // tiêu đề lớn (h1) ở Hero
  description: 'Hơn 10 năm kinh nghiệm, giao hàng toàn quốc, tư vấn tận tâm.', // Hero, footer, SEO
  phone: '0932194320',
  email: 'congtytrungquanphat@gmail.com',
  hours: '8:00 - 20:00',
  address: 'Số 15-17 B6, KP 11, Phường Tân Triều, TP Đồng Nai',
  // Câu giới thiệu mục Dịch vụ (trang chủ, /services). Nêu theo nhóm việc, không liệt kê từng dịch vụ,
  // để thêm/xóa dịch vụ trong serviceData.ts mà câu này ít phải sửa. Cập nhật nếu nhóm dịch vụ đổi hẳn.
  servicesIntro:
    'Tư vấn lựa chọn thiết bị và hỗ trợ thi công, lắp đặt cho nhà xưởng, cửa hàng và công trình.',
  // Mạng xã hội: để chuỗi rỗng thì nút tương ứng ở footer tự ẩn
  socials: {
    zalo: 'https://zalo.me/0932194320',
    facebook: '',
  },
}

// Link Google Maps tìm theo địa chỉ công ty
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`

export const navItems: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Dịch vụ', href: '/services' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Liên hệ', href: '/contact' },
]

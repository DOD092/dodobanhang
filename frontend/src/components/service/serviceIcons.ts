import type { ComponentType, SVGProps } from 'react'

import { FactoryIcon, OrderIcon, WrenchIcon } from '@/components/common/Icons'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

// Service không có field icon (giữ đúng schema) nên gán icon theo id; id khác dùng icon mặc định.
// Thêm/đổi dịch vụ thì cập nhật map này. Dùng chung cho ServiceCard (trang chủ) và ServicePanel.
const serviceIcons: Record<number, IconComponent> = {
  1: OrderIcon, // Tư vấn thiết bị công nghiệp
  2: WrenchIcon, // Hỗ trợ thi công - lắp đặt thiết bị
}

export function getServiceIcon(id: number): IconComponent {
  return serviceIcons[id] ?? FactoryIcon
}

import type { Service } from '@/types/Service'

import { services } from './serviceData'

// Chỉ dịch vụ đang bật (is_active), sắp theo sort_order (số nhỏ trước, bằng nhau thì theo id).
// filter() tạo mảng mới nên sort() không làm đổi thứ tự của mảng gốc.
function visibleServices(): Service[] {
  return services
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
}

export async function getServices(): Promise<Service[]> {
  return visibleServices()
}

// Dịch vụ đang tắt (is_active = false) coi như không tồn tại: trang chi tiết trả 404
export async function getServiceById(id: number): Promise<Service | undefined> {
  return visibleServices().find((item) => item.id === id)
}

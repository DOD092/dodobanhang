import {
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@/components/common/Icons'
import type { CoreValue } from '@/config/home'

// Icon theo key `icon` của từng giá trị cốt lõi (config/home.ts). File thường (không 'use client')
// để dùng chung cho CoreValues (trang chủ, Server Component) và CoreValuePanels (/about, Client).
export const coreValueIcons: Record<CoreValue['icon'], typeof HeartIcon> = {
  dedication: HeartIcon,
  trust: ShieldCheckIcon,
  quality: StarIcon,
  companion: UsersIcon,
  growth: TrendingUpIcon,
}

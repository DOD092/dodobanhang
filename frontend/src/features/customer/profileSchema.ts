import { z } from 'zod'

// Form sửa hồ sơ, khớp UpdateProfileDto của backend (họ tên <= 150, SĐT <= 20, giới tính <= 20)
export const GENDER_OPTIONS = [
  { value: '', label: 'Không chọn' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Nhập họ tên').max(150, 'Tối đa 150 ký tự'),
  phone: z
    .string()
    .trim()
    .max(20, 'Tối đa 20 ký tự')
    .refine((v) => v === '' || /^\+?[\d\s.-]{8,19}$/.test(v), 'Số điện thoại không hợp lệ'),
  dateOfBirth: z
    .string()
    .refine((v) => v === '' || new Date(v) <= new Date(), 'Ngày sinh không hợp lệ'),
  gender: z.enum(['', 'male', 'female', 'other']),
})

export type ProfileInput = z.infer<typeof profileSchema>

// Ảnh đại diện: cùng giới hạn với backend (avatarUploadOptions)
export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

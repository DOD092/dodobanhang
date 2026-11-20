import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nhập họ tên').max(150),
    email: z.email('Email không hợp lệ').max(255),
    phone: z.string().trim().max(20).optional(),
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(72),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Nhập mật khẩu'),
})

// Đặt lại mật khẩu: khớp ResetPasswordDto của backend (mã 6 số, mật khẩu 8-72 ký tự)
export const resetPasswordSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, 'Mã gồm 6 chữ số'),
    newPassword: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(72, 'Tối đa 72 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

// Đổi mật khẩu khi đã đăng nhập: khớp ChangePasswordDto (mới 8-72 ký tự, phải khác mật khẩu cũ)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(72, 'Tối đa 72 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ['newPassword'],
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

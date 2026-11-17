import { z } from 'zod'

// Schema validate form Liên hệ, bám theo types/Contact.ts (các field form đang có).
// Giữ khớp với backend/src/module/contact/dto/create-contact.dto.ts (backend kiểm lại lần nữa).
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên của bạn')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên tối đa 100 ký tự'),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .transform((value) => value.replace(/[\s.-]/g, ''))
    .pipe(z.string().regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ (vd: 0932194320)')),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .max(150, 'Email tối đa 150 ký tự')
    .pipe(z.email('Email không hợp lệ')),
  content: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập nội dung')
    .min(10, 'Nội dung phải có ít nhất 10 ký tự')
    .max(2000, 'Nội dung tối đa 2000 ký tự'),
})

export type ContactFormInput = z.input<typeof contactSchema>
export type ContactFormValues = z.output<typeof contactSchema>

import { z } from 'zod'

// Khớp CreateMyAddressDto của backend
export const addressSchema = z.object({
  receiverName: z.string().trim().min(2, 'Nhập họ tên người nhận').max(150, 'Tối đa 150 ký tự'),
  // Cho phép gõ "0912 345 678" / "0912.345.678": bỏ khoảng trắng, dấu chấm, gạch rồi mới kiểm tra
  receiverPhone: z
    .string()
    .transform((value) => value.replace(/[\s.-]/g, ''))
    .pipe(z.string().regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ')),
  addressLine: z.string().trim().min(5, 'Nhập số nhà, tên đường').max(255, 'Tối đa 255 ký tự'),
  ward: z.string().trim().min(1, 'Nhập phường / xã').max(100, 'Tối đa 100 ký tự'),
  district: z.string().trim().min(1, 'Nhập quận / huyện').max(100, 'Tối đa 100 ký tự'),
  province: z.string().trim().min(1, 'Nhập tỉnh / thành phố').max(100, 'Tối đa 100 ký tự'),
  isDefault: z.boolean(),
})

export type AddressInput = z.input<typeof addressSchema>
export type AddressOutput = z.output<typeof addressSchema>

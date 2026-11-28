import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

// Cách thanh toán khách chọn trên web. PAYOS = chuyển khoản QR qua payOS
// (lưu payments.payment_method = BANK_TRANSFER, provider = 'PAYOS').
export const CHECKOUT_PAYMENT_METHODS = ['COD', 'PAYOS'] as const;
export type CheckoutPaymentMethod = (typeof CHECKOUT_PAYMENT_METHODS)[number];

export class CheckoutDto {
  @ApiProperty({ format: 'uuid', description: 'Địa chỉ trong /addresses/me' })
  @IsUUID()
  addressId: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  customerNote?: string;

  @ApiProperty({ enum: CHECKOUT_PAYMENT_METHODS })
  @IsIn(CHECKOUT_PAYMENT_METHODS, {
    message: 'Phương thức thanh toán không hợp lệ.',
  })
  paymentMethod: CheckoutPaymentMethod;
}

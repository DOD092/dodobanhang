import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export const MAX_CART_QUANTITY = 99;

// Chỉ nhận biến thể + số lượng. KHÔNG nhận userId / giá từ client.
export class AddToCartDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  variantId: string;

  @ApiProperty({ minimum: 1, maximum: MAX_CART_QUANTITY, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_CART_QUANTITY)
  quantity: number = 1;
}

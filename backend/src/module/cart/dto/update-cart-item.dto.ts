import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { MAX_CART_QUANTITY } from './add-to-cart.dto';

// Đặt LẠI số lượng của 1 dòng trong giỏ (không cộng dồn). Muốn bỏ hẳn thì gọi DELETE.
export class UpdateMyCartItemDto {
  @ApiProperty({ minimum: 1, maximum: MAX_CART_QUANTITY })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_CART_QUANTITY)
  quantity: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { CartStatus } from '../../../common/enum/cart-status.enum';

export class CreateCartDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: CartStatus })
  @IsEnum(CartStatus)
  status: CartStatus;
}

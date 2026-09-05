import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderVoucherDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  voucherId: string;

  @ApiProperty({ maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  voucherCode: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount: number;
}

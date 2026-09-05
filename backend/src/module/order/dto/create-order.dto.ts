import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { OrderStatus } from '../../../common/enum/order-status.enum';
import { PaymentStatus } from '../../../common/enum/payment.enum';

export class CreateOrderDto {
  @ApiProperty({ maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  orderCode: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  shippingAddressId: string;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @ApiProperty({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount: number;

  @ApiProperty({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shippingFee: number;

  @ApiProperty({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxAmount: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerNote?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  confirmedAt?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  cancelledAt?: Date;
}

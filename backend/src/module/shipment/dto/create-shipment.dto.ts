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
import { ShipmentCarrier } from '../../../common/enum/shipment.enum';
import { ShipmentStatus } from '../../../common/enum/shipment.enum';

export class CreateShipmentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ enum: ShipmentCarrier })
  @IsEnum(ShipmentCarrier)
  carrier: ShipmentCarrier;

  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  trackingNumber: string;

  @ApiProperty({ enum: ShipmentStatus })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @ApiProperty({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shippingFee: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  shippedAt?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;
}

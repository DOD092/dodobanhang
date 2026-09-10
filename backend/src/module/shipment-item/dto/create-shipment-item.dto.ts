import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateShipmentItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  shipmentId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderItemId: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

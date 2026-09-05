import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  variantId: string;

  @ApiProperty({ default: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  quantityOnHand: number;

  @ApiProperty({ default: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  quantityReserved: number;

  @ApiProperty({ default: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  quantityAvailable: number;
}

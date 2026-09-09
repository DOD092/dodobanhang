import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateWarehouseOperatorDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  employeeCode: string;

  @ApiProperty({ maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  shift: string;

  @ApiProperty({ maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  status: string;
}

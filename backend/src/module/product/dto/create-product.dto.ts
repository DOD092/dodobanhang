import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  brandId: string;

  @ApiProperty({ maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  status: string;
}

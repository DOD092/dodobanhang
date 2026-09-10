import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @ApiProperty({ maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  status: string;
}

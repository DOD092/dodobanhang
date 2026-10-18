import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCustomerProfileDto {
  @ApiPropertyOptional({ maxLength: 150 })
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(150)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()   
  phone?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2004-02-09' })
  @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ maxLength: 20 })
  @IsOptional() @IsString() @MaxLength(20)
  gender?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStaffAccountDto {
  @ApiProperty({
    example: 'operator01@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Operator@123',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'Nguyễn Văn Operator',
  })
  @IsString()
  fullName!: string;

  @ApiProperty({
    example: 'WAREHOUSE_OPERATOR',
    enum: ['ADMIN', 'WAREHOUSE_OPERATOR'],
  })
  @IsIn(['ADMIN', 'WAREHOUSE_OPERATOR'])
  role!: string;

  @ApiPropertyOptional({
    example: '0901234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateStaffAccountResponseDto {
  id!: string;
  email!: string;
  fullName!: string;
  role!: string;
}
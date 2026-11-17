import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Bám đúng contactSchema (Zod) của frontend: frontend chặn trước, đây là lớp chặn cuối.
export class CreateContactDto {
  @ApiProperty({ minLength: 2, maxLength: 100 })
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '0932194320', description: '0 hoặc +84 rồi 9 số' })
  // Bỏ khoảng trắng, dấu chấm, gạch như frontend
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/[\s.-]/g, '') : value,
  )
  @IsString()
  @Matches(/^(0|\+84)\d{9}$/, { message: 'phone không hợp lệ' })
  phone: string;

  @ApiProperty({ maxLength: 150 })
  @Transform(trim)
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ minLength: 10, maxLength: 2000 })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  content: string;
}

import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Dữ liệu khách hàng tự đăng ký. Mỗi field BẮT BUỘC có decorator của
 * class-validator: ValidationPipe chạy `whitelist: true` +
 * `forbidNonWhitelisted: true` (xem main.ts), field không có decorator bị coi
 * là field lạ và trả về 400 "property ... should not exist".
 *
 * AuthService tự điền 4 trường còn lại, KHÔNG nhận từ client:
 *   User.status            -> UserStatus.ACTIVE
 *   User.roleId            -> id của role CUSTOMER (tra từ bảng roles)
 *   Customer.customerCode  -> mã tự sinh (cột NOT NULL + UNIQUE)
 *   Customer.loyaltyPoints -> 0
 * Để client tự truyền thì ai cũng đăng ký được tài khoản ADMIN hoặc tự cộng
 * điểm thưởng cho mình.
 */
export class CustomerRegisterRequestDto {
  @AutoMap()
  @ApiProperty({ maxLength: 255, example: 'khachhang@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  // KHÔNG có @AutoMap(): mật khẩu thô không bao giờ được automap thẳng sang
  // User. AuthService hash bằng bcrypt rồi mới gán vào cột password_hash.
  // Trần 72: bcrypt chỉ đọc 72 byte đầu, ký tự sau đó bị bỏ qua âm thầm.
  @ApiProperty({ minLength: 8, maxLength: 72, example: 'Matkhau@123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @AutoMap()
  @ApiProperty({ maxLength: 150, example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @AutoMap()
  @ApiPropertyOptional({ maxLength: 20, example: '0901234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @AutoMap(() => Date)
  @ApiPropertyOptional({ type: String, format: 'date', example: '2000-01-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @AutoMap()
  @ApiPropertyOptional({ maxLength: 20, example: 'male' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;
}

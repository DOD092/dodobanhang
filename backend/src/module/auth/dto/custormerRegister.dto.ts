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
 * Dữ liệu khách hàng tự đăng ký tài khoản — gộp phần nhập được của cả 2 entity:
 * `User` (thông tin tài khoản) và `Customer` (hồ sơ khách hàng).
 *
 * AuthService.customerRegister() phải tự điền 4 trường còn lại, KHÔNG nhận từ client:
 *   User.status        -> UserStatus.ACTIVE
 *   User.roleId        -> id của role CUSTOMER (tra từ bảng roles)
 *   Customer.userId    -> id của User vừa tạo
 *   Customer.loyaltyPoints -> 0
 * Lý do: để client tự truyền thì ai cũng đăng ký được tài khoản ADMIN
 * hoặc tự cộng điểm thưởng cho mình. Xem giải thích ở cuối file.
 */
export class CustomerRegisterDto {
  // ----- User -----

  @ApiProperty({ maxLength: 255, example: 'khachhang@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ maxLength: 20, example: '0901234567' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  // Mật khẩu thô, AuthService hash bằng bcrypt rồi mới ghi vào cột password_hash.
  // Trần 72: bcrypt chỉ đọc 72 byte đầu, ký tự sau đó bị bỏ qua âm thầm.
  @ApiProperty({ minLength: 8, maxLength: 72 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({ maxLength: 150, example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  fullName: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2000-01-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  // ----- Customer -----

  // Bỏ trống thì AuthService phải tự sinh mã, vì cột customer_code là
  // NOT NULL + UNIQUE — không sinh là insert fail.
  @ApiPropertyOptional({
    maxLength: 50,
    description: 'Bỏ trống để hệ thống tự sinh',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string;
}

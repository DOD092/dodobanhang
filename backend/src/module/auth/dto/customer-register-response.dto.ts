import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Kết quả trả về sau khi đăng ký. Là class chứ không phải interface, vì
 * interface bị xoá lúc compile nên Swagger không đọc được schema từ nó.
 * Không trả passwordHash, roleId hay loyaltyPoints ra ngoài.
 */
export class CustomerRegisterResponseDto {
  @ApiProperty({ format: 'uuid' })
  userId: string;

  // customers dùng chung khoá chính với users (quan hệ 1-1) nên luôn bằng userId
  @ApiProperty({ format: 'uuid' })
  customerId: string;

  @ApiProperty({ example: 'CUS-M2K4X1P-A3F9C2' })
  customerCode: string;

  @ApiProperty({ example: 'khachhang@example.com' })
  email: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  fullName: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2000-01-31' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'male' })
  gender?: string;
}

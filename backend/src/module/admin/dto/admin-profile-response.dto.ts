import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// employeeCode / department / position chỉ có trong response: admin tự sửa
// profile qua UpdateProfileDto chỉ đụng tới bảng users, không đổi chức vụ.
export class AdminProfileResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() fullName: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() avatarUrl?: string;
  @ApiPropertyOptional() dateOfBirth?: Date;
  @ApiPropertyOptional() gender?: string;
  @ApiProperty() employeeCode: string;
  @ApiProperty() department: string;
  @ApiProperty() position: string;
}

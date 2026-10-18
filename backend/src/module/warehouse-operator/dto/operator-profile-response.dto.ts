import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// employeeCode / warehouseId / shift / status chỉ có trong response: đó là
// thông tin admin phân công, operator không tự sửa được qua UpdateProfileDto.
export class OperatorProfileResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() fullName: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() avatarUrl?: string;
  @ApiPropertyOptional() dateOfBirth?: Date;
  @ApiPropertyOptional() gender?: string;
  @ApiProperty() employeeCode: string;
  @ApiProperty() warehouseId: string;
  @ApiProperty() shift: string;
  @ApiProperty() status: string;
}

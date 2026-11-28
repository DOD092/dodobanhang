import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Matches } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

// Khách tự thêm địa chỉ: userId lấy từ JWT, country mặc định VN (DB default)
export class CreateMyAddressDto extends OmitType(CreateAddressDto, [
  'userId',
  'country',
  'isDefault',
  'receiverPhone',
] as const) {
  // SĐT Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx (frontend đã bỏ khoảng trắng / dấu chấm)
  @Matches(/^(0|\+84)\d{9}$/, { message: 'Số điện thoại không hợp lệ.' })
  receiverPhone: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

// userId là khoá chính (lấy từ users) nên không cho phép sửa
export class UpdateAdminDto extends PartialType(
  OmitType(CreateAdminDto, ['userId'] as const),
) {}

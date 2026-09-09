import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateWarehouseOperatorDto } from './create-warehouse-operator.dto';

// userId là khoá chính (lấy từ users) nên không cho phép sửa
export class UpdateWarehouseOperatorDto extends PartialType(
  OmitType(CreateWarehouseOperatorDto, ['userId'] as const),
) {}

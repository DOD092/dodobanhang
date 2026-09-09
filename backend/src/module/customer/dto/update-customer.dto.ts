import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

// userId là khoá chính (lấy từ users) nên không cho phép sửa
export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ['userId'] as const),
) {}

import { PartialType } from '@nestjs/swagger';
import { CreateOrderVoucherDto } from './create-order-voucher.dto';

export class UpdateOrderVoucherDto extends PartialType(CreateOrderVoucherDto) {}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateOrderVoucherDto } from '../dto/create-order-voucher.dto';
import { UpdateOrderVoucherDto } from '../dto/update-order-voucher.dto';
import { OrderVoucher } from '../entities/order-voucher.entity';

export interface IOrderVoucherService {
  create(dto: CreateOrderVoucherDto): Promise<OrderVoucher>;
  findAll(pagination: PaginationQueryDto): Promise<OrderVoucher[]>;
  findOne(id: string): Promise<OrderVoucher>;
  update(id: string, dto: UpdateOrderVoucherDto): Promise<OrderVoucher>;
  remove(id: string): Promise<void>;
}

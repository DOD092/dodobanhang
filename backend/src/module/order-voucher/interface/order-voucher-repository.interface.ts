import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderVoucher } from '../entities/order-voucher.entity';

export interface IOrderVoucherRepository {
  create(dto: DeepPartial<OrderVoucher>): Promise<OrderVoucher>;
  findAll(pagination: PaginationQueryDto): Promise<OrderVoucher[]>;
  findOne(id: string): Promise<OrderVoucher>;
  update(id: string, dto: DeepPartial<OrderVoucher>): Promise<OrderVoucher>;
  remove(id: string): Promise<void>;
}

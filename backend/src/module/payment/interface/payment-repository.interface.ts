import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  create(dto: DeepPartial<Payment>): Promise<Payment>;
  findAll(pagination: PaginationQueryDto): Promise<Payment[]>;
  findOne(id: string): Promise<Payment>;
  update(id: string, dto: DeepPartial<Payment>): Promise<Payment>;
  remove(id: string): Promise<void>;
}

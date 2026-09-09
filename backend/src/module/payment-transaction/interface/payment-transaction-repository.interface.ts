import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

export interface IPaymentTransactionRepository {
  create(dto: DeepPartial<PaymentTransaction>): Promise<PaymentTransaction>;
  findAll(pagination: PaginationQueryDto): Promise<PaymentTransaction[]>;
  findOne(id: string): Promise<PaymentTransaction>;
  update(
    id: string,
    dto: DeepPartial<PaymentTransaction>,
  ): Promise<PaymentTransaction>;
  remove(id: string): Promise<void>;
}

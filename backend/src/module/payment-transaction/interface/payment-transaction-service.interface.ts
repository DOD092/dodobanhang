import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreatePaymentTransactionDto } from '../dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from '../dto/update-payment-transaction.dto';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

export interface IPaymentTransactionService {
  create(dto: CreatePaymentTransactionDto): Promise<PaymentTransaction>;
  findAll(pagination: PaginationQueryDto): Promise<PaymentTransaction[]>;
  findOne(id: string): Promise<PaymentTransaction>;
  update(
    id: string,
    dto: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransaction>;
  remove(id: string): Promise<void>;
}

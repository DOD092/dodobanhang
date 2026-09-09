import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_TRANSACTION_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { IPaymentTransactionRepository } from './interface/payment-transaction-repository.interface';
import { IPaymentTransactionService } from './interface/payment-transaction-service.interface';

@Injectable()
export class PaymentTransactionService implements IPaymentTransactionService {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
  ) {}

  create(dto: CreatePaymentTransactionDto): Promise<PaymentTransaction> {
    return this.paymentTransactionRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<PaymentTransaction[]> {
    return this.paymentTransactionRepository.findAll(pagination);
  }

  findOne(id: string): Promise<PaymentTransaction> {
    return this.paymentTransactionRepository.findOne(id);
  }

  update(
    id: string,
    dto: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransaction> {
    return this.paymentTransactionRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.paymentTransactionRepository.remove(id);
  }
}

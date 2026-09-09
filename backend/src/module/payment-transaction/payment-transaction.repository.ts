import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { IPaymentTransactionRepository } from './interface/payment-transaction-repository.interface';

@Injectable()
export class PaymentTransactionRepository
  extends BaseRepository<PaymentTransaction>
  implements IPaymentTransactionRepository
{
  constructor(
    @InjectRepository(PaymentTransaction)
    repository: Repository<PaymentTransaction>,
  ) {
    super(repository, 'PaymentTransaction');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Payment } from './entities/payment.entity';
import { IPaymentRepository } from './interface/payment-repository.interface';

@Injectable()
export class PaymentRepository
  extends BaseRepository<Payment>
  implements IPaymentRepository
{
  constructor(
    @InjectRepository(Payment)
    repository: Repository<Payment>,
  ) {
    super(repository, 'Payment');
  }
}

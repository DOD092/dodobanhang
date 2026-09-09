import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { IPaymentRepository } from './interface/payment-repository.interface';
import { IPaymentService } from './interface/payment-service.interface';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  create(dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Payment[]> {
    return this.paymentRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Payment> {
    return this.paymentRepository.findOne(id);
  }

  update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.paymentRepository.remove(id);
  }
}

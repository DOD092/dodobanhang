import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { PaymentTransaction } from './entities/payment-transaction.entity';

@Injectable()
export class PaymentTransactionService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
  ) {}

  async create(dto: CreatePaymentTransactionDto): Promise<PaymentTransaction> {
    const entity = this.paymentTransactionRepository.create(dto);
    return await this.paymentTransactionRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<PaymentTransaction[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.paymentTransactionRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<PaymentTransaction> {
    const entity = await this.paymentTransactionRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`PaymentTransaction ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdatePaymentTransactionDto): Promise<PaymentTransaction> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.paymentTransactionRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.paymentTransactionRepository.remove(entity);
  }
}

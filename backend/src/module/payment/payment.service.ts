import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const entity = this.paymentRepository.create(dto);
    return await this.paymentRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Payment[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.paymentRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Payment> {
    const entity = await this.paymentRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.paymentRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.paymentRepository.remove(entity);
  }
}

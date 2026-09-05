import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderVoucherDto } from './dto/create-order-voucher.dto';
import { UpdateOrderVoucherDto } from './dto/update-order-voucher.dto';
import { OrderVoucher } from './entities/order-voucher.entity';

@Injectable()
export class OrderVoucherService {
  constructor(
    @InjectRepository(OrderVoucher)
    private readonly orderVoucherRepository: Repository<OrderVoucher>,
  ) {}

  async create(dto: CreateOrderVoucherDto): Promise<OrderVoucher> {
    const entity = this.orderVoucherRepository.create(dto);
    return await this.orderVoucherRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<OrderVoucher[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.orderVoucherRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<OrderVoucher> {
    const entity = await this.orderVoucherRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`OrderVoucher ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateOrderVoucherDto): Promise<OrderVoucher> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.orderVoucherRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.orderVoucherRepository.remove(entity);
  }
}

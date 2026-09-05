import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';
import { OrderStatusHistory } from './entities/order-status-history.entity';

@Injectable()
export class OrderStatusHistoryService {
  constructor(
    @InjectRepository(OrderStatusHistory)
    private readonly orderStatusHistoryRepository: Repository<OrderStatusHistory>,
  ) {}

  async create(dto: CreateOrderStatusHistoryDto): Promise<OrderStatusHistory> {
    const entity = this.orderStatusHistoryRepository.create(dto);
    return await this.orderStatusHistoryRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<OrderStatusHistory[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.orderStatusHistoryRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<OrderStatusHistory> {
    const entity = await this.orderStatusHistoryRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`OrderStatusHistory ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateOrderStatusHistoryDto): Promise<OrderStatusHistory> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.orderStatusHistoryRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.orderStatusHistoryRepository.remove(entity);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const entity = this.orderItemRepository.create(dto);
    return await this.orderItemRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<OrderItem[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.orderItemRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<OrderItem> {
    const entity = await this.orderItemRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`OrderItem ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.orderItemRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.orderItemRepository.remove(entity);
  }
}

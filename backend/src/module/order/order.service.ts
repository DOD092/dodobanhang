import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const entity = this.orderRepository.create(dto);
    return await this.orderRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Order[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.orderRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Order> {
    const entity = await this.orderRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.orderRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.orderRepository.remove(entity);
  }
}

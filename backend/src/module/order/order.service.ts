import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { IOrderRepository } from './interface/order-repository.interface';
import { IOrderService } from './interface/order-service.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  create(dto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Order[]> {
    return this.orderRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne(id);
  }

  update(id: string, dto: UpdateOrderDto): Promise<Order> {
    return this.orderRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.orderRepository.remove(id);
  }
}

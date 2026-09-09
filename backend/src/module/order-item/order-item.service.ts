import { Inject, Injectable } from '@nestjs/common';
import { ORDER_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { IOrderItemRepository } from './interface/order-item-repository.interface';
import { IOrderItemService } from './interface/order-item-service.interface';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  create(dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<OrderItem[]> {
    return this.orderItemRepository.findAll(pagination);
  }

  findOne(id: string): Promise<OrderItem> {
    return this.orderItemRepository.findOne(id);
  }

  update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.orderItemRepository.remove(id);
  }
}

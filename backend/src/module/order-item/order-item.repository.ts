import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { OrderItem } from './entities/order-item.entity';
import { IOrderItemRepository } from './interface/order-item-repository.interface';

@Injectable()
export class OrderItemRepository
  extends BaseRepository<OrderItem>
  implements IOrderItemRepository
{
  constructor(
    @InjectRepository(OrderItem)
    repository: Repository<OrderItem>,
  ) {
    super(repository, 'OrderItem');
  }
}

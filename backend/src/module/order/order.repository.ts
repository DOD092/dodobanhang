import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Order } from './entities/order.entity';
import { IOrderRepository } from './interface/order-repository.interface';

@Injectable()
export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor(
    @InjectRepository(Order)
    repository: Repository<Order>,
  ) {
    super(repository, 'Order');
  }
}

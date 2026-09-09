import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { IOrderStatusHistoryRepository } from './interface/order-status-history-repository.interface';

@Injectable()
export class OrderStatusHistoryRepository
  extends BaseRepository<OrderStatusHistory>
  implements IOrderStatusHistoryRepository
{
  constructor(
    @InjectRepository(OrderStatusHistory)
    repository: Repository<OrderStatusHistory>,
  ) {
    super(repository, 'OrderStatusHistory');
  }
}

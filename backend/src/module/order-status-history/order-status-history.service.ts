import { Inject, Injectable } from '@nestjs/common';
import { ORDER_STATUS_HISTORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { IOrderStatusHistoryRepository } from './interface/order-status-history-repository.interface';
import { IOrderStatusHistoryService } from './interface/order-status-history-service.interface';

@Injectable()
export class OrderStatusHistoryService implements IOrderStatusHistoryService {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly orderStatusHistoryRepository: IOrderStatusHistoryRepository,
  ) {}

  create(dto: CreateOrderStatusHistoryDto): Promise<OrderStatusHistory> {
    return this.orderStatusHistoryRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<OrderStatusHistory[]> {
    return this.orderStatusHistoryRepository.findAll(pagination);
  }

  findOne(id: string): Promise<OrderStatusHistory> {
    return this.orderStatusHistoryRepository.findOne(id);
  }

  update(
    id: string,
    dto: UpdateOrderStatusHistoryDto,
  ): Promise<OrderStatusHistory> {
    return this.orderStatusHistoryRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.orderStatusHistoryRepository.remove(id);
  }
}

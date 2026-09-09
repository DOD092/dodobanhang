import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderStatusHistory } from '../entities/order-status-history.entity';

export interface IOrderStatusHistoryRepository {
  create(dto: DeepPartial<OrderStatusHistory>): Promise<OrderStatusHistory>;
  findAll(pagination: PaginationQueryDto): Promise<OrderStatusHistory[]>;
  findOne(id: string): Promise<OrderStatusHistory>;
  update(
    id: string,
    dto: DeepPartial<OrderStatusHistory>,
  ): Promise<OrderStatusHistory>;
  remove(id: string): Promise<void>;
}

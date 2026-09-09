import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateOrderStatusHistoryDto } from '../dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from '../dto/update-order-status-history.dto';
import { OrderStatusHistory } from '../entities/order-status-history.entity';

export interface IOrderStatusHistoryService {
  create(dto: CreateOrderStatusHistoryDto): Promise<OrderStatusHistory>;
  findAll(pagination: PaginationQueryDto): Promise<OrderStatusHistory[]>;
  findOne(id: string): Promise<OrderStatusHistory>;
  update(
    id: string,
    dto: UpdateOrderStatusHistoryDto,
  ): Promise<OrderStatusHistory>;
  remove(id: string): Promise<void>;
}

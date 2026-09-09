import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { OrderItem } from '../entities/order-item.entity';

export interface IOrderItemService {
  create(dto: CreateOrderItemDto): Promise<OrderItem>;
  findAll(pagination: PaginationQueryDto): Promise<OrderItem[]>;
  findOne(id: string): Promise<OrderItem>;
  update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem>;
  remove(id: string): Promise<void>;
}

import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderItem } from '../entities/order-item.entity';

export interface IOrderItemRepository {
  create(dto: DeepPartial<OrderItem>): Promise<OrderItem>;
  findAll(pagination: PaginationQueryDto): Promise<OrderItem[]>;
  findOne(id: string): Promise<OrderItem>;
  update(id: string, dto: DeepPartial<OrderItem>): Promise<OrderItem>;
  remove(id: string): Promise<void>;
}

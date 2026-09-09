import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  create(dto: DeepPartial<Order>): Promise<Order>;
  findAll(pagination: PaginationQueryDto): Promise<Order[]>;
  findOne(id: string): Promise<Order>;
  update(id: string, dto: DeepPartial<Order>): Promise<Order>;
  remove(id: string): Promise<void>;
}

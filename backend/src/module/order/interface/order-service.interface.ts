import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

export interface IOrderService {
  create(dto: CreateOrderDto): Promise<Order>;
  findAll(pagination: PaginationQueryDto): Promise<Order[]>;
  findOne(id: string): Promise<Order>;
  update(id: string, dto: UpdateOrderDto): Promise<Order>;
  remove(id: string): Promise<void>;
}

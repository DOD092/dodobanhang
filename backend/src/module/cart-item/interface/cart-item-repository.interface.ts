import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CartItem } from '../entities/cart-item.entity';

export interface ICartItemRepository {
  create(dto: DeepPartial<CartItem>): Promise<CartItem>;
  findAll(pagination: PaginationQueryDto): Promise<CartItem[]>;
  findOne(id: string): Promise<CartItem>;
  update(id: string, dto: DeepPartial<CartItem>): Promise<CartItem>;
  remove(id: string): Promise<void>;
}

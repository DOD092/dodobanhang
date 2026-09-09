import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Cart } from '../entities/cart.entity';

export interface ICartRepository {
  create(dto: DeepPartial<Cart>): Promise<Cart>;
  findAll(pagination: PaginationQueryDto): Promise<Cart[]>;
  findOne(id: string): Promise<Cart>;
  update(id: string, dto: DeepPartial<Cart>): Promise<Cart>;
  remove(id: string): Promise<void>;
}

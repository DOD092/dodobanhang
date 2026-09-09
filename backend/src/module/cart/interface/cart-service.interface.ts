import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { Cart } from '../entities/cart.entity';

export interface ICartService {
  create(dto: CreateCartDto): Promise<Cart>;
  findAll(pagination: PaginationQueryDto): Promise<Cart[]>;
  findOne(id: string): Promise<Cart>;
  update(id: string, dto: UpdateCartDto): Promise<Cart>;
  remove(id: string): Promise<void>;
}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItem } from '../entities/cart-item.entity';

export interface ICartItemService {
  create(dto: CreateCartItemDto): Promise<CartItem>;
  findAll(pagination: PaginationQueryDto): Promise<CartItem[]>;
  findOne(id: string): Promise<CartItem>;
  update(id: string, dto: UpdateCartItemDto): Promise<CartItem>;
  remove(id: string): Promise<void>;
}

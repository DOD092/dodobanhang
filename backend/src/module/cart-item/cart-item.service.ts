import { Inject, Injectable } from '@nestjs/common';
import { CART_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { ICartItemRepository } from './interface/cart-item-repository.interface';
import { ICartItemService } from './interface/cart-item-service.interface';

@Injectable()
export class CartItemService implements ICartItemService {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  create(dto: CreateCartItemDto): Promise<CartItem> {
    return this.cartItemRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<CartItem[]> {
    return this.cartItemRepository.findAll(pagination);
  }

  findOne(id: string): Promise<CartItem> {
    return this.cartItemRepository.findOne(id);
  }

  update(id: string, dto: UpdateCartItemDto): Promise<CartItem> {
    return this.cartItemRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.cartItemRepository.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { CartItem } from './entities/cart-item.entity';
import { ICartItemRepository } from './interface/cart-item-repository.interface';

@Injectable()
export class CartItemRepository
  extends BaseRepository<CartItem>
  implements ICartItemRepository
{
  constructor(
    @InjectRepository(CartItem)
    repository: Repository<CartItem>,
  ) {
    super(repository, 'CartItem');
  }
}

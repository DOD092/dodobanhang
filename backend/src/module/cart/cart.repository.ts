import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Cart } from './entities/cart.entity';
import { ICartRepository } from './interface/cart-repository.interface';

@Injectable()
export class CartRepository
  extends BaseRepository<Cart>
  implements ICartRepository
{
  constructor(
    @InjectRepository(Cart)
    repository: Repository<Cart>,
  ) {
    super(repository, 'Cart');
  }
}

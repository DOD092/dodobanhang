import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { ICartRepository } from './interface/cart-repository.interface';
import { ICartService } from './interface/cart-service.interface';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  create(dto: CreateCartDto): Promise<Cart> {
    return this.cartRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Cart[]> {
    return this.cartRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Cart> {
    return this.cartRepository.findOne(id);
  }

  update(id: string, dto: UpdateCartDto): Promise<Cart> {
    return this.cartRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.cartRepository.remove(id);
  }
}

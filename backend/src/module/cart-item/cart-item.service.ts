import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(dto: CreateCartItemDto): Promise<CartItem> {
    const entity = this.cartItemRepository.create(dto);
    return await this.cartItemRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<CartItem[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.cartItemRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<CartItem> {
    const entity = await this.cartItemRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`CartItem ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateCartItemDto): Promise<CartItem> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.cartItemRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.cartItemRepository.remove(entity);
  }
}

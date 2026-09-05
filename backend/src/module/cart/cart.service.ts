import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async create(dto: CreateCartDto): Promise<Cart> {
    const entity = this.cartRepository.create(dto);
    return await this.cartRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Cart[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.cartRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Cart> {
    const entity = await this.cartRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Cart ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateCartDto): Promise<Cart> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.cartRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.cartRepository.remove(entity);
  }
}

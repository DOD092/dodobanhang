import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const entity = this.productRepository.create(dto);
    return await this.productRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Product[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.productRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Product> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.productRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.productRepository.remove(entity);
  }
}

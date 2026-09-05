import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(dto: CreateProductImageDto): Promise<ProductImage> {
    const entity = this.productImageRepository.create(dto);
    return await this.productImageRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<ProductImage[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.productImageRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<ProductImage> {
    const entity = await this.productImageRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`ProductImage ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateProductImageDto): Promise<ProductImage> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.productImageRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.productImageRepository.remove(entity);
  }
}

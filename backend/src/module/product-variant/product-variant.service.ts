import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    const entity = this.productVariantRepository.create(dto);
    return await this.productVariantRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<ProductVariant[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.productVariantRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<ProductVariant> {
    const entity = await this.productVariantRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`ProductVariant ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateProductVariantDto): Promise<ProductVariant> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.productVariantRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.productVariantRepository.remove(entity);
  }
}

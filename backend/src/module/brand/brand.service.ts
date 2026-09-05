import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto): Promise<Brand> {
    const entity = this.brandRepository.create(dto);
    return await this.brandRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Brand[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.brandRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Brand> {
    const entity = await this.brandRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Brand ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.brandRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.brandRepository.remove(entity);
  }
}

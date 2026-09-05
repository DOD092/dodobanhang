import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const entity = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Category[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.categoryRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Category> {
    const entity = await this.categoryRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.categoryRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.categoryRepository.remove(entity);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ICategoryRepository } from './interface/category-repository.interface';
import { ICategoryService } from './interface/category-service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Category[]> {
    return this.categoryRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne(id);
  }

  update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.categoryRepository.remove(id);
  }
}

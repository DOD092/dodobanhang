import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

export interface ICategoryService {
  create(dto: CreateCategoryDto): Promise<Category>;
  findAll(pagination: PaginationQueryDto): Promise<Category[]>;
  findOne(id: string): Promise<Category>;
  update(id: string, dto: UpdateCategoryDto): Promise<Category>;
  remove(id: string): Promise<void>;
}

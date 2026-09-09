import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(dto: DeepPartial<Category>): Promise<Category>;
  findAll(pagination: PaginationQueryDto): Promise<Category[]>;
  findOne(id: string): Promise<Category>;
  update(id: string, dto: DeepPartial<Category>): Promise<Category>;
  remove(id: string): Promise<void>;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Category } from './entities/category.entity';
import { ICategoryRepository } from './interface/category-repository.interface';

@Injectable()
export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
  ) {
    super(repository, 'Category');
  }
}

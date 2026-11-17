import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { PUBLIC_STATUS } from '../product/product.constants';
import { Category } from './entities/category.entity';
import {
  CategoryWithCount,
  ICategoryRepository,
} from './interface/category-repository.interface';

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

  async findPublicWithProductCount(): Promise<CategoryWithCount[]> {
    const { entities, raw } = await this.repository
      .createQueryBuilder('category')
      .addSelect(
        `(SELECT COUNT(*) FROM products p WHERE p.category_id = category.id AND p.status = :status)`,
        'product_count',
      )
      .where('category.status = :status', { status: PUBLIC_STATUS })
      .orderBy('category.createdAt', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getRawAndEntities<{ product_count: string }>();

    // Không join nên raw[i] khớp entities[i]; COUNT trả về string (bigint)
    return entities.map((category, index) => ({
      ...category,
      productCount: Number(raw[index].product_count),
    }));
  }
}

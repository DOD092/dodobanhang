import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import {
  CategoryWithCount,
  ICategoryRepository,
} from './interface/category-repository.interface';
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

  // productCount = sản phẩm của chính nhóm + mọi nhóm con (khớp với bộ lọc /products/search,
  // vốn lọc theo cả cây con). Cộng dồn trong bộ nhớ: số category nhỏ.
  async findPublicWithProductCount(): Promise<CategoryWithCount[]> {
    const categories =
      await this.categoryRepository.findPublicWithProductCount();
    const children = new Map<string, CategoryWithCount[]>();
    for (const category of categories) {
      if (!category.parentId) continue;
      children.set(category.parentId, [
        ...(children.get(category.parentId) ?? []),
        category,
      ]);
    }
    const total = (
      category: CategoryWithCount,
      seen = new Set<string>(),
    ): number => {
      if (seen.has(category.id)) return 0; // phòng dữ liệu parent_id bị vòng
      seen.add(category.id);
      return (children.get(category.id) ?? []).reduce(
        (sum, child) => sum + total(child, seen),
        category.productCount,
      );
    };
    return categories.map((category) => ({
      ...category,
      productCount: total(category),
    }));
  }
}

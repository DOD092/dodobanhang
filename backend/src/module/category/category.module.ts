import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { CATEGORY_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Dòng này quyết định việc sinh bảng
  controllers: [CategoryController],
  providers: [
    { provide: CATEGORY_SERVICE, useClass: CategoryService },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
  ],
  exports: [CATEGORY_SERVICE],
})
export class CategoryModule {}

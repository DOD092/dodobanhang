import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PRODUCT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Dòng này quyết định việc sinh bảng
  controllers: [ProductController],
  providers: [
    { provide: PRODUCT_SERVICE, useClass: ProductService },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
  exports: [PRODUCT_SERVICE],
})
export class ProductModule {}

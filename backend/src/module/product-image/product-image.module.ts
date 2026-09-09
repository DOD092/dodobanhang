import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCT_IMAGE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PRODUCT_IMAGE_SERVICE } from '../../common/dependency-injection/service.tokens';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageController } from './product-image.controller';
import { ProductImageRepository } from './product-image.repository';
import { ProductImageService } from './product-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])], // Dòng này quyết định việc sinh bảng
  controllers: [ProductImageController],
  providers: [
    { provide: PRODUCT_IMAGE_SERVICE, useClass: ProductImageService },
    { provide: PRODUCT_IMAGE_REPOSITORY, useClass: ProductImageRepository },
  ],
  exports: [PRODUCT_IMAGE_SERVICE],
})
export class ProductImageModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCT_VARIANT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PRODUCT_VARIANT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantRepository } from './product-variant.repository';
import { ProductVariantService } from './product-variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])], // Dòng này quyết định việc sinh bảng
  controllers: [ProductVariantController],
  providers: [
    { provide: PRODUCT_VARIANT_SERVICE, useClass: ProductVariantService },
    {
      provide: PRODUCT_VARIANT_REPOSITORY,
      useClass: ProductVariantRepository,
    },
  ],
  exports: [PRODUCT_VARIANT_SERVICE],
})
export class ProductVariantModule {}

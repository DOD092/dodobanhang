import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])], // Dòng này quyết định việc sinh bảng
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}

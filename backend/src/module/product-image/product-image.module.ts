import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageController } from './product-image.controller';
import { ProductImageService } from './product-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])], // Dòng này quyết định việc sinh bảng
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}

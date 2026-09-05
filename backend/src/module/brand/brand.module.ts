import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])], // Dòng này quyết định việc sinh bảng
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}

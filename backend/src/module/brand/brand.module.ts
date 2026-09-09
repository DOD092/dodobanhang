import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BRAND_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { BRAND_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Brand } from './entities/brand.entity';
import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])], // Dòng này quyết định việc sinh bảng
  controllers: [BrandController],
  providers: [
    { provide: BRAND_SERVICE, useClass: BrandService },
    { provide: BRAND_REPOSITORY, useClass: BrandRepository },
  ],
  exports: [BRAND_SERVICE],
})
export class BrandModule {}

import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_IMAGE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImage } from './entities/product-image.entity';
import { IProductImageRepository } from './interface/product-image-repository.interface';
import { IProductImageService } from './interface/product-image-service.interface';

@Injectable()
export class ProductImageService implements IProductImageService {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly productImageRepository: IProductImageRepository,
  ) {}

  create(dto: CreateProductImageDto): Promise<ProductImage> {
    return this.productImageRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<ProductImage[]> {
    return this.productImageRepository.findAll(pagination);
  }

  findOne(id: string): Promise<ProductImage> {
    return this.productImageRepository.findOne(id);
  }

  update(id: string, dto: UpdateProductImageDto): Promise<ProductImage> {
    return this.productImageRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.productImageRepository.remove(id);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_VARIANT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { IProductVariantRepository } from './interface/product-variant-repository.interface';
import { IProductVariantService } from './interface/product-variant-service.interface';

@Injectable()
export class ProductVariantService implements IProductVariantService {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: IProductVariantRepository,
  ) {}

  create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    return this.productVariantRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<ProductVariant[]> {
    return this.productVariantRepository.findAll(pagination);
  }

  findOne(id: string): Promise<ProductVariant> {
    return this.productVariantRepository.findOne(id);
  }

  update(id: string, dto: UpdateProductVariantDto): Promise<ProductVariant> {
    return this.productVariantRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.productVariantRepository.remove(id);
  }
}

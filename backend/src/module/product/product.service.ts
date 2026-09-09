import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { IProductRepository } from './interface/product-repository.interface';
import { IProductService } from './interface/product-service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Product[]> {
    return this.productRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.productRepository.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ProductVariant } from './entities/product-variant.entity';
import { IProductVariantRepository } from './interface/product-variant-repository.interface';

@Injectable()
export class ProductVariantRepository
  extends BaseRepository<ProductVariant>
  implements IProductVariantRepository
{
  constructor(
    @InjectRepository(ProductVariant)
    repository: Repository<ProductVariant>,
  ) {
    super(repository, 'ProductVariant');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ProductImage } from './entities/product-image.entity';
import { IProductImageRepository } from './interface/product-image-repository.interface';

@Injectable()
export class ProductImageRepository
  extends BaseRepository<ProductImage>
  implements IProductImageRepository
{
  constructor(
    @InjectRepository(ProductImage)
    repository: Repository<ProductImage>,
  ) {
    super(repository, 'ProductImage');
  }
}

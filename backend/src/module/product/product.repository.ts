import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Product } from './entities/product.entity';
import { IProductRepository } from './interface/product-repository.interface';

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository, 'Product');
  }
}

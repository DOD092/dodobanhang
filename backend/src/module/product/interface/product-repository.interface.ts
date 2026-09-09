import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(dto: DeepPartial<Product>): Promise<Product>;
  findAll(pagination: PaginationQueryDto): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  update(id: string, dto: DeepPartial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
}

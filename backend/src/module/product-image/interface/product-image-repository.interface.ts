import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ProductImage } from '../entities/product-image.entity';

export interface IProductImageRepository {
  create(dto: DeepPartial<ProductImage>): Promise<ProductImage>;
  findAll(pagination: PaginationQueryDto): Promise<ProductImage[]>;
  findOne(id: string): Promise<ProductImage>;
  update(id: string, dto: DeepPartial<ProductImage>): Promise<ProductImage>;
  remove(id: string): Promise<void>;
}

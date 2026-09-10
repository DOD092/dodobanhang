import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ProductVariant } from '../entities/product-variant.entity';

export interface IProductVariantRepository {
  create(dto: DeepPartial<ProductVariant>): Promise<ProductVariant>;
  findAll(pagination: PaginationQueryDto): Promise<ProductVariant[]>;
  findOne(id: string): Promise<ProductVariant>;
  update(id: string, dto: DeepPartial<ProductVariant>): Promise<ProductVariant>;
  remove(id: string): Promise<void>;
}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../dto/update-product-variant.dto';
import { ProductVariant } from '../entities/product-variant.entity';

export interface IProductVariantService {
  create(dto: CreateProductVariantDto): Promise<ProductVariant>;
  findAll(pagination: PaginationQueryDto): Promise<ProductVariant[]>;
  findOne(id: string): Promise<ProductVariant>;
  update(id: string, dto: UpdateProductVariantDto): Promise<ProductVariant>;
  remove(id: string): Promise<void>;
}

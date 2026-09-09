import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { ProductImage } from '../entities/product-image.entity';

export interface IProductImageService {
  create(dto: CreateProductImageDto): Promise<ProductImage>;
  findAll(pagination: PaginationQueryDto): Promise<ProductImage[]>;
  findOne(id: string): Promise<ProductImage>;
  update(id: string, dto: UpdateProductImageDto): Promise<ProductImage>;
  remove(id: string): Promise<void>;
}

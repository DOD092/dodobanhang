import { Category } from '../../category/entities/category.entity';
import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { SearchProductQueryDto } from '../dto/search-product-query.dto';
import { Product } from '../entities/product.entity';

/** Sản phẩm (đã join category) kèm biến thể + ảnh, chưa map sang DTO. */
export type CatalogProductRows = {
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
  // Chỉ có ở findPublicBySlug: danh mục từ gốc tới nhóm của sản phẩm (breadcrumb)
  categoryPath?: Category[];
}[];

export interface IProductRepository {
  create(dto: DeepPartial<Product>): Promise<Product>;
  findAll(pagination: PaginationQueryDto): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  update(id: string, dto: DeepPartial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
  // Web bán hàng: chỉ sản phẩm + category có status ACTIVE
  search(
    query: SearchProductQueryDto,
  ): Promise<{ rows: CatalogProductRows; total: number; page: number }>;
  findPublicBySlug(slug: string): Promise<CatalogProductRows[number] | null>;
}

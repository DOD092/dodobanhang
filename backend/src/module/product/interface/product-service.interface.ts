import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export interface IProductService {
  create(dto: CreateProductDto): Promise<Product>;
  findAll(pagination: PaginationQueryDto): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}

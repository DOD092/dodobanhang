import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ProductDetailDto,
  ProductPageDto,
  ProductSummaryDto,
} from './dto/product-catalog.dto';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {
  CatalogProductRows,
  IProductRepository,
} from './interface/product-repository.interface';
import { IProductService } from './interface/product-service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Product[]> {
    return this.productRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.productRepository.remove(id);
  }

  async search(query: SearchProductQueryDto): Promise<ProductPageDto> {
    const { rows, total, page } = await this.productRepository.search(query);

    return {
      items: rows.map((row) => toSummary(row)),
      total,
      page,
      pageSize: query.limit,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async findPublicBySlug(slug: string): Promise<ProductDetailDto> {
    const row = await this.productRepository.findPublicBySlug(slug);
    if (!row) {
      throw new NotFoundException(`Product ${slug} not found`);
    }

    return {
      ...toSummary(row),
      variants: row.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        variantName: variant.variantName,
        price: variant.price,
      })),
    };
  }
}

function toSummary({
  product,
  variants,
  images,
}: CatalogProductRows[number]): ProductSummaryDto {
  const prices = variants
    .map((variant) => variant.price)
    .filter((price): price is number => price !== null);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? null,
    description: product.description ?? null,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    sku: variants[0]?.sku ?? null,
    price: prices.length > 0 ? Math.min(...prices) : null,
    images: images.map((image) => image.imageUrl),
  };
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Response cho web bán hàng (khác entity: đã gộp category, giá, SKU, ảnh).

export class CatalogCategoryRefDto {
  @ApiProperty({ format: 'uuid' }) id: string;
  @ApiProperty() name: string;
  @ApiProperty() slug: string;
}

export class CatalogVariantDto {
  @ApiProperty({ format: 'uuid' }) id: string;
  @ApiProperty() sku: string;
  @ApiProperty() variantName: string;
  @ApiProperty({ type: Number, nullable: true }) price: number | null;
}

export class ProductSummaryDto {
  @ApiProperty({ format: 'uuid' }) id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  shortDescription: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  description: string | null;
  @ApiProperty({ type: CatalogCategoryRefDto })
  category: CatalogCategoryRefDto;
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'SKU của biến thể đầu tiên',
  })
  sku: string | null;
  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'Giá thấp nhất trong các biến thể; null = "Liên hệ"',
  })
  price: number | null;
  @ApiProperty({
    type: [String],
    description: 'URL ảnh, ảnh chính trước rồi theo sort_order',
  })
  images: string[];
}

export class ProductDetailDto extends ProductSummaryDto {
  @ApiProperty({ type: [CatalogVariantDto] })
  variants: CatalogVariantDto[];
}

export class ProductPageDto {
  @ApiProperty({ type: [ProductSummaryDto] }) items: ProductSummaryDto[];
  @ApiProperty() total: number;
  @ApiProperty({ description: 'Trang thực tế (vượt quá thì về trang cuối)' })
  page: number;
  @ApiProperty() pageSize: number;
  @ApiProperty() totalPages: number;
}

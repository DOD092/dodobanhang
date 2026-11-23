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
  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Giá gốc (gạch ngang)',
  })
  compareAtPrice: number | null;
}

export class CatalogSpecificationDto {
  @ApiProperty() name: string;
  @ApiProperty() value: string;
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
  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description:
      'Giá gốc của biến thể rẻ nhất (gạch ngang); null nếu không giảm giá',
  })
  compareAtPrice: number | null;
  @ApiProperty({ description: 'Phần trăm giảm (0 nếu không giảm)' })
  discountPercent: number;
  @ApiPropertyOptional({ type: String, nullable: true }) author: string | null;
  @ApiProperty() brandName: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) ratingAverage:
    number | null;
  @ApiProperty() reviewCount: number;
  @ApiProperty() soldCount: number;
}

export class ProductDetailDto extends ProductSummaryDto {
  @ApiProperty({ type: [CatalogVariantDto] })
  variants: CatalogVariantDto[];
  @ApiProperty({ type: [CatalogSpecificationDto] })
  specifications: CatalogSpecificationDto[];
  @ApiProperty({
    type: [CatalogCategoryRefDto],
    description: 'Đường dẫn danh mục từ gốc tới nhóm của sản phẩm (breadcrumb)',
  })
  categoryPath: CatalogCategoryRefDto[];
}

export class ProductPageDto {
  @ApiProperty({ type: [ProductSummaryDto] }) items: ProductSummaryDto[];
  @ApiProperty() total: number;
  @ApiProperty({ description: 'Trang thực tế (vượt quá thì về trang cuối)' })
  page: number;
  @ApiProperty() pageSize: number;
  @ApiProperty() totalPages: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/pagination.constant';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import {
  PRODUCT_SORTS,
  SEARCH_MAX_LIMIT,
  type ProductSort,
} from '../product.constants';

export class SearchProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    maxLength: 100,
    description:
      'Từ khoá, không phân biệt dấu/hoa thường. Nhiều từ thì phải khớp đủ các từ ' +
      '(tìm trong tên, mô tả, SKU).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    description: 'Slug của category (lấy cả sản phẩm thuộc các category con)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  category?: string;

  @ApiPropertyOptional({ minimum: 0, description: 'Giá >= minPrice' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Giá < maxPrice' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 5,
    description: 'Điểm đánh giá >= minRating',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ enum: PRODUCT_SORTS, default: 'newest' })
  @IsOptional()
  @IsIn(PRODUCT_SORTS)
  sort: ProductSort = 'newest';

  // Ghi đè để chặn trên: endpoint công khai, không cho lấy cả bảng một lần
  @ApiPropertyOptional({
    default: DEFAULT_PAGE_SIZE,
    minimum: 1,
    maximum: SEARCH_MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SEARCH_MAX_LIMIT)
  limit: number = DEFAULT_PAGE_SIZE;
}

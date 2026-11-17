import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PRODUCT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailDto, ProductPageDto } from './dto/product-catalog.dto';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductService } from './interface/product-service.interface';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productService: IProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Product' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List products (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.productService.findAll(pagination);
  }

  // 2 route dưới phải khai báo TRƯỚC `:id`, nếu không 'search'/'slug' bị bắt
  // vào `:id` và ParseUUIDPipe trả 400.
  @Get('search')
  @ApiOperation({
    summary: 'Web bán hàng: tìm + lọc + sắp xếp + phân trang',
    description:
      'Chỉ sản phẩm và category có status ACTIVE. Kèm category, SKU, giá thấp nhất, ảnh.',
  })
  @ApiOkResponse({ type: ProductPageDto })
  search(@Query() query: SearchProductQueryDto) {
    return this.productService.search(query);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Web bán hàng: chi tiết sản phẩm theo slug' })
  @ApiOkResponse({ type: ProductDetailDto })
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findPublicBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Product by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Product' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Product' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}

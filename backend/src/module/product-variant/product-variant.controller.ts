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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PRODUCT_VARIANT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { IProductVariantService } from './interface/product-variant-service.interface';

@ApiTags('product-variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(
    @Inject(PRODUCT_VARIANT_SERVICE)
    private readonly productVariantService: IProductVariantService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ProductVariant' })
  create(@Body() dto: CreateProductVariantDto) {
    return this.productVariantService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List product-variants (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.productVariantService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ProductVariant by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productVariantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ProductVariant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ProductVariant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productVariantService.remove(id);
  }
}

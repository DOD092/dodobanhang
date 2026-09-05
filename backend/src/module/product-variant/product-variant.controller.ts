import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@ApiTags('product-variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

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

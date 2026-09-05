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
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@ApiTags('product-images')
@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ProductImage' })
  create(@Body() dto: CreateProductImageDto) {
    return this.productImageService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List product-images (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.productImageService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ProductImage by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productImageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ProductImage' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ProductImage' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productImageService.remove(id);
  }
}

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
import { CART_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ICartItemService } from './interface/cart-item-service.interface';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController {
  constructor(
    @Inject(CART_ITEM_SERVICE)
    private readonly cartItemService: ICartItemService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CartItem' })
  create(@Body() dto: CreateCartItemDto) {
    return this.cartItemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List cart-items (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.cartItemService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a CartItem by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a CartItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a CartItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartItemService.remove(id);
  }
}

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
import { ORDER_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { IOrderItemService } from './interface/order-item-service.interface';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemController {
  constructor(
    @Inject(ORDER_ITEM_SERVICE)
    private readonly orderItemService: IOrderItemService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new OrderItem' })
  create(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List order-items (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.orderItemService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a OrderItem by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a OrderItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a OrderItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderItemService.remove(id);
  }
}

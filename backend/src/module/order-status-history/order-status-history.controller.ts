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
import { OrderStatusHistoryService } from './order-status-history.service';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';

@ApiTags('order-status-history')
@Controller('order-status-history')
export class OrderStatusHistoryController {
  constructor(private readonly orderStatusHistoryService: OrderStatusHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new OrderStatusHistory' })
  create(@Body() dto: CreateOrderStatusHistoryDto) {
    return this.orderStatusHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List order-status-history (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.orderStatusHistoryService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a OrderStatusHistory by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderStatusHistoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a OrderStatusHistory' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusHistoryDto,
  ) {
    return this.orderStatusHistoryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a OrderStatusHistory' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderStatusHistoryService.remove(id);
  }
}

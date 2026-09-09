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
import { ORDER_STATUS_HISTORY_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';
import { IOrderStatusHistoryService } from './interface/order-status-history-service.interface';

@ApiTags('order-status-history')
@Controller('order-status-history')
export class OrderStatusHistoryController {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_SERVICE)
    private readonly orderStatusHistoryService: IOrderStatusHistoryService,
  ) {}

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

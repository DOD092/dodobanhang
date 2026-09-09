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
import { ORDER_VOUCHER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderVoucherDto } from './dto/create-order-voucher.dto';
import { UpdateOrderVoucherDto } from './dto/update-order-voucher.dto';
import { IOrderVoucherService } from './interface/order-voucher-service.interface';

@ApiTags('order-vouchers')
@Controller('order-vouchers')
export class OrderVoucherController {
  constructor(
    @Inject(ORDER_VOUCHER_SERVICE)
    private readonly orderVoucherService: IOrderVoucherService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new OrderVoucher' })
  create(@Body() dto: CreateOrderVoucherDto) {
    return this.orderVoucherService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List order-vouchers (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.orderVoucherService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a OrderVoucher by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderVoucherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a OrderVoucher' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderVoucherDto,
  ) {
    return this.orderVoucherService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a OrderVoucher' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderVoucherService.remove(id);
  }
}

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
import { ShipmentItemService } from './shipment-item.service';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';

@ApiTags('shipment-items')
@Controller('shipment-items')
export class ShipmentItemController {
  constructor(private readonly shipmentItemService: ShipmentItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ShipmentItem' })
  create(@Body() dto: CreateShipmentItemDto) {
    return this.shipmentItemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List shipment-items (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.shipmentItemService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ShipmentItem by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shipmentItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ShipmentItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShipmentItemDto,
  ) {
    return this.shipmentItemService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ShipmentItem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shipmentItemService.remove(id);
  }
}

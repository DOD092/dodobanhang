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
import { SHIPMENT_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import { IShipmentItemService } from './interface/shipment-item-service.interface';

@ApiTags('shipment-items')
@Controller('shipment-items')
export class ShipmentItemController {
  constructor(
    @Inject(SHIPMENT_ITEM_SERVICE)
    private readonly shipmentItemService: IShipmentItemService,
  ) {}

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

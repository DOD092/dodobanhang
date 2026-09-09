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
import { WAREHOUSE_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { IWarehouseService } from './interface/warehouse-service.interface';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(
    @Inject(WAREHOUSE_SERVICE)
    private readonly warehouseService: IWarehouseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Warehouse' })
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List warehouses (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.warehouseService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Warehouse by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Warehouse' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Warehouse' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.warehouseService.remove(id);
  }
}

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
import { WarehouseOperatorService } from './warehouse-operator.service';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';

@ApiTags('warehouse-operators')
@Controller('warehouse-operators')
export class WarehouseOperatorController {
  constructor(private readonly warehouseOperatorService: WarehouseOperatorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new WarehouseOperator' })
  create(@Body() dto: CreateWarehouseOperatorDto) {
    return this.warehouseOperatorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List warehouse-operators (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.warehouseOperatorService.findAll(pagination);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a WarehouseOperator by user id' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.warehouseOperatorService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update a WarehouseOperator' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateWarehouseOperatorDto,
  ) {
    return this.warehouseOperatorService.update(userId, dto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a WarehouseOperator' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.warehouseOperatorService.remove(userId);
  }
}

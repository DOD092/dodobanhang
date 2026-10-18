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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CUSTOMER_SERVICE, WAREHOUSE_OPERATOR_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';
import { IWarehouseOperatorService } from './interface/warehouse-operator-service.interface';
import { ICustomerService } from '../customer/interface/customer-service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetCustomerByCodeResponseDto } from '../customer/dto/get-customer-by-code-response.dto';

@ApiTags('warehouse-operators')
@Controller('warehouse-operators')
export class WarehouseOperatorController {
  constructor(
    @Inject(WAREHOUSE_OPERATOR_SERVICE)
    private readonly warehouseOperatorService: IWarehouseOperatorService,
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: ICustomerService,
  ) {}

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

  @Get('customers/code/:customerCode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('WAREHOUSE_OPERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Operator tra cứu thông tin customer theo mã' })
  @ApiParam({ name: 'customerCode', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: GetCustomerByCodeResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy khách hàng' })
  getCustomerByCode(
    @Param('customerCode') customerCode: string,
    @Req() req: any,
  ) {
    return this.customerService.getCustomerByCode(customerCode, req.user);
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

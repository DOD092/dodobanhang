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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CUSTOMER_SERVICE, WAREHOUSE_OPERATOR_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { avatarUploadOptions } from '../../common/upload/avatar-upload.options';
import { GetCustomerByCodeResponseDto } from '../customer/dto/get-customer-by-code-response.dto';
import { ICustomerService } from '../customer/interface/customer-service.interface';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { OperatorProfileResponseDto } from './dto/operator-profile-response.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';
import { IWarehouseOperatorService } from './interface/warehouse-operator-service.interface';

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

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('WAREHOUSE_OPERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Operator tự cập nhật thông tin cá nhân' })
  @ApiResponse({ status: HttpStatus.OK, type: OperatorProfileResponseDto })
  updateMyProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.warehouseOperatorService.updateMyProfile(req.user.id, dto);
  }

  @Patch('me/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('WAREHOUSE_OPERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Operator đổi ảnh đại diện' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', avatarUploadOptions))
  updateMyAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.warehouseOperatorService.updateMyAvatar(req.user.id, file);
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

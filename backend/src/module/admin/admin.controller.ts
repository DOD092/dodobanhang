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
import { ADMIN_SERVICE, CUSTOMER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { avatarUploadOptions } from '../../common/upload/avatar-upload.options';
import { GetCustomerByCodeResponseDto } from '../customer/dto/get-customer-by-code-response.dto';
import { ICustomerService } from '../customer/interface/customer-service.interface';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { AdminProfileResponseDto } from './dto/admin-profile-response.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IAdminService } from './interface/admin-service.interface';

@ApiTags('admins')
@Controller('admins')
export class AdminController {
  constructor(
    @Inject(ADMIN_SERVICE) private readonly adminService: IAdminService,
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: ICustomerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Admin' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List admins (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.adminService.findAll(pagination);
  }

  @Get('customers/code/:customerCode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin tra cứu thông tin customer theo mã' })
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
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin tự cập nhật thông tin cá nhân' })
  @ApiResponse({ status: HttpStatus.OK, type: AdminProfileResponseDto })
  updateMyProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.adminService.updateMyProfile(req.user.id, dto);
  }

  @Patch('me/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin đổi ảnh đại diện' })
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
    return this.adminService.updateMyAvatar(req.user.id, file);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get an Admin by user id' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.adminService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update an Admin' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.adminService.update(userId, dto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an Admin' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.adminService.remove(userId);
  }
}

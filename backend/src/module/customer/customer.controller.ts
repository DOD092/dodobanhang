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
  UploadedFile, 
  UseInterceptors, 
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CUSTOMER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerByCodeResponseDto } from './dto/get-customer-by-code-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ICustomerService } from './interface/customer-service.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { extname, join } from 'path';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CustomerProfileResponseDto } from './dto/customer-profile-response.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: ICustomerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Customer' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List customers (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.customerService.findAll(pagination);
  }

    @Patch('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Customer tự cập nhật thông tin cá nhân' })
  @ApiResponse({ status: HttpStatus.OK, type: CustomerProfileResponseDto })
  updateMyProfile(@Req() req: any, @Body() dto: UpdateCustomerProfileDto) {
    return this.customerService.updateMyProfile(req.user.id, dto);
  }

  @Patch('me/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Customer đổi ảnh đại diện' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'avatars');
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh jpg, png, webp'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  updateMyAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.customerService.updateMyAvatar(req.user.id, file);
  }


  @Get('code/:customerCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a Customer by customer code',
    description: 'ADMIN / WAREHOUSE_OPERATOR xem mọi customer; CUSTOMER chỉ xem được chính mình',
  })
  @ApiParam({ name: 'customerCode', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCustomerByCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng với mã cung cấp',
  })
  getCustomerByCode(
    @Param('customerCode') customerCode: string,
    @Req() req: any,
  ) {
    return this.customerService.getCustomerByCode(customerCode, req.user);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a Customer by user id' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.customerService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update a Customer' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.update(userId, dto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Customer' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.customerService.remove(userId);
  }
}

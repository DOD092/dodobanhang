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
import { ADMIN_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IAdminService } from './interface/admin-service.interface';

@ApiTags('admins')
@Controller('admins')
export class AdminController {
  constructor(
    @Inject(ADMIN_SERVICE) private readonly adminService: IAdminService,
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

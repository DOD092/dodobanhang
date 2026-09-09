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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Role' })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List roles (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.roleService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Role by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Role' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Role' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.remove(id);
  }
}

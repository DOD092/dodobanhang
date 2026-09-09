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
import { ADDRESS_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IAddressService } from './interface/address-service.interface';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(
    @Inject(ADDRESS_SERVICE) private readonly addressService: IAddressService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Address' })
  create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List addresses (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.addressService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Address by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Address' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Address' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.remove(id);
  }
}

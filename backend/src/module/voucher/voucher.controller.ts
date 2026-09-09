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
import { VOUCHER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { IVoucherService } from './interface/voucher-service.interface';

@ApiTags('vouchers')
@Controller('vouchers')
export class VoucherController {
  constructor(
    @Inject(VOUCHER_SERVICE) private readonly voucherService: IVoucherService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Voucher' })
  create(@Body() dto: CreateVoucherDto) {
    return this.voucherService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List vouchers (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.voucherService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Voucher by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.voucherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Voucher' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVoucherDto,
  ) {
    return this.voucherService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Voucher' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.voucherService.remove(id);
  }
}

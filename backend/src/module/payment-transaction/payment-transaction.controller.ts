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
import { PAYMENT_TRANSACTION_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { IPaymentTransactionService } from './interface/payment-transaction-service.interface';

@ApiTags('payment-transactions')
@Controller('payment-transactions')
export class PaymentTransactionController {
  constructor(
    @Inject(PAYMENT_TRANSACTION_SERVICE)
    private readonly paymentTransactionService: IPaymentTransactionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PaymentTransaction' })
  create(@Body() dto: CreatePaymentTransactionDto) {
    return this.paymentTransactionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List payment-transactions (paginated)' })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.paymentTransactionService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PaymentTransaction by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentTransactionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PaymentTransaction' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentTransactionDto,
  ) {
    return this.paymentTransactionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a PaymentTransaction' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentTransactionService.remove(id);
  }
}

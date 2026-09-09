import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_VOUCHER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ORDER_VOUCHER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { OrderVoucher } from './entities/order-voucher.entity';
import { OrderVoucherController } from './order-voucher.controller';
import { OrderVoucherRepository } from './order-voucher.repository';
import { OrderVoucherService } from './order-voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderVoucher])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderVoucherController],
  providers: [
    { provide: ORDER_VOUCHER_SERVICE, useClass: OrderVoucherService },
    { provide: ORDER_VOUCHER_REPOSITORY, useClass: OrderVoucherRepository },
  ],
  exports: [ORDER_VOUCHER_SERVICE],
})
export class OrderVoucherModule {}

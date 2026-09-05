import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderVoucher } from './entities/order-voucher.entity';
import { OrderVoucherController } from './order-voucher.controller';
import { OrderVoucherService } from './order-voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderVoucher])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderVoucherController],
  providers: [OrderVoucherService],
  exports: [OrderVoucherService],
})
export class OrderVoucherModule {}

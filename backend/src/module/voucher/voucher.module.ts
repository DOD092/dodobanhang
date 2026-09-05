import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])], // Dòng này quyết định việc sinh bảng
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}

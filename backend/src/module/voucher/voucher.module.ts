import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VOUCHER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { VOUCHER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Voucher } from './entities/voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])], // Dòng này quyết định việc sinh bảng
  controllers: [VoucherController],
  providers: [
    { provide: VOUCHER_SERVICE, useClass: VoucherService },
    { provide: VOUCHER_REPOSITORY, useClass: VoucherRepository },
  ],
  exports: [VOUCHER_SERVICE],
})
export class VoucherModule {}

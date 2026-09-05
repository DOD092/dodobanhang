import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentTransactionController } from './payment-transaction.controller';
import { PaymentTransactionService } from './payment-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])], // Dòng này quyết định việc sinh bảng
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
  exports: [PaymentTransactionService],
})
export class PaymentTransactionModule {}

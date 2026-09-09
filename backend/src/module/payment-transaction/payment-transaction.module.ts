import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PAYMENT_TRANSACTION_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PAYMENT_TRANSACTION_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentTransactionController } from './payment-transaction.controller';
import { PaymentTransactionRepository } from './payment-transaction.repository';
import { PaymentTransactionService } from './payment-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])], // Dòng này quyết định việc sinh bảng
  controllers: [PaymentTransactionController],
  providers: [
    {
      provide: PAYMENT_TRANSACTION_SERVICE,
      useClass: PaymentTransactionService,
    },
    {
      provide: PAYMENT_TRANSACTION_REPOSITORY,
      useClass: PaymentTransactionRepository,
    },
  ],
  exports: [PAYMENT_TRANSACTION_SERVICE],
})
export class PaymentTransactionModule {}

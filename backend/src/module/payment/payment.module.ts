import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PAYMENT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PAYMENT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])], // Dòng này quyết định việc sinh bảng
  controllers: [PaymentController],
  providers: [
    { provide: PAYMENT_SERVICE, useClass: PaymentService },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
  ],
  exports: [PAYMENT_SERVICE],
})
export class PaymentModule {}

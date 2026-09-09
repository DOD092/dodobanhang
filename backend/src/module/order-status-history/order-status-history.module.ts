import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_STATUS_HISTORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ORDER_STATUS_HISTORY_SERVICE } from '../../common/dependency-injection/service.tokens';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { OrderStatusHistoryController } from './order-status-history.controller';
import { OrderStatusHistoryRepository } from './order-status-history.repository';
import { OrderStatusHistoryService } from './order-status-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusHistory])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderStatusHistoryController],
  providers: [
    {
      provide: ORDER_STATUS_HISTORY_SERVICE,
      useClass: OrderStatusHistoryService,
    },
    {
      provide: ORDER_STATUS_HISTORY_REPOSITORY,
      useClass: OrderStatusHistoryRepository,
    },
  ],
  exports: [ORDER_STATUS_HISTORY_SERVICE],
})
export class OrderStatusHistoryModule {}

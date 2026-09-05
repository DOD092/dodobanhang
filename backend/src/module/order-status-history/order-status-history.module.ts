import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { OrderStatusHistoryController } from './order-status-history.controller';
import { OrderStatusHistoryService } from './order-status-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusHistory])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderStatusHistoryController],
  providers: [OrderStatusHistoryService],
  exports: [OrderStatusHistoryService],
})
export class OrderStatusHistoryModule {}

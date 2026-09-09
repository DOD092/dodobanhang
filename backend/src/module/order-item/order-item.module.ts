import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ORDER_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemController } from './order-item.controller';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderItemController],
  providers: [
    { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
    { provide: ORDER_ITEM_REPOSITORY, useClass: OrderItemRepository },
  ],
  exports: [ORDER_ITEM_SERVICE],
})
export class OrderItemModule {}

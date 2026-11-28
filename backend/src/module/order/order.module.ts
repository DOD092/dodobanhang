import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import {
  MY_ORDER_SERVICE,
  ORDER_SERVICE,
} from '../../common/dependency-injection/service.tokens';
import { PayosModule } from '../payos/payos.module';
import { Order } from './entities/order.entity';
import { MyOrderController } from './my-order.controller';
import { MyOrderService } from './my-order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { PayosWebhookController } from './payos-webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), PayosModule], // forFeature quyết định việc sinh bảng
  // MyOrderController (/orders/me) đứng TRƯỚC để route 'me' không bị ':id' của CRUD thô bắt
  controllers: [MyOrderController, PayosWebhookController, OrderController],
  providers: [
    { provide: ORDER_SERVICE, useClass: OrderService },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: MY_ORDER_SERVICE, useClass: MyOrderService },
  ],
  exports: [ORDER_SERVICE],
})
export class OrderModule {}

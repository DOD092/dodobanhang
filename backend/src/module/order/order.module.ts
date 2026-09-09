import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ORDER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])], // Dòng này quyết định việc sinh bảng
  controllers: [OrderController],
  providers: [
    { provide: ORDER_SERVICE, useClass: OrderService },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
  ],
  exports: [ORDER_SERVICE],
})
export class OrderModule {}

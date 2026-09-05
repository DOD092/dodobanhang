import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])], // Dòng này quyết định việc sinh bảng
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}

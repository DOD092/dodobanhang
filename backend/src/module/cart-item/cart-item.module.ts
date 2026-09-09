import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CART_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { CART_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { CartItem } from './entities/cart-item.entity';
import { CartItemController } from './cart-item.controller';
import { CartItemRepository } from './cart-item.repository';
import { CartItemService } from './cart-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])], // Dòng này quyết định việc sinh bảng
  controllers: [CartItemController],
  providers: [
    { provide: CART_ITEM_SERVICE, useClass: CartItemService },
    { provide: CART_ITEM_REPOSITORY, useClass: CartItemRepository },
  ],
  exports: [CART_ITEM_SERVICE],
})
export class CartItemModule {}

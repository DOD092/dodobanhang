import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CART_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { CART_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Cart } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { MyCartController } from './my-cart.controller';
import { MyCartService } from './my-cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])], // Dòng này quyết định việc sinh bảng
  // MyCartController: /cart/me (giỏ của người đang đăng nhập, cần JWT); CartController: CRUD thô cũ
  controllers: [CartController, MyCartController],
  providers: [
    { provide: CART_SERVICE, useClass: CartService },
    { provide: CART_REPOSITORY, useClass: CartRepository },
    MyCartService,
  ],
  exports: [CART_SERVICE, MyCartService],
})
export class CartModule {}

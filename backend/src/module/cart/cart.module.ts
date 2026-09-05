import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])], // Dòng này quyết định việc sinh bảng
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

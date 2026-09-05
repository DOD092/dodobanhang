import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AddressModule } from './module/address/address.module';
import { AdminModule } from './module/admin/admin.module';
import { BrandModule } from './module/brand/brand.module';
import { CartItemModule } from './module/cart-item/cart-item.module';
import { CartModule } from './module/cart/cart.module';
import { CategoryModule } from './module/category/category.module';
import { InventoryModule } from './module/inventory/inventory.module';
import { OrderItemModule } from './module/order-item/order-item.module';
import { OrderStatusHistoryModule } from './module/order-status-history/order-status-history.module';
import { OrderVoucherModule } from './module/order-voucher/order-voucher.module';
import { OrderModule } from './module/order/order.module';
import { PaymentTransactionModule } from './module/payment-transaction/payment-transaction.module';
import { PaymentModule } from './module/payment/payment.module';
import { ProductImageModule } from './module/product-image/product-image.module';
import { ProductVariantModule } from './module/product-variant/product-variant.module';
import { ProductModule } from './module/product/product.module';
import { ReviewModule } from './module/review/review.module';
import { ShipmentModule } from './module/shipment/shipment.module';
import { UserModule } from './module/user/user.module';
import { VoucherModule } from './module/voucher/voucher.module';
import { WarehouseModule } from './module/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Cấu hình kết nối TypeORM tới PostgreSQL trên Aiven (Cloud)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '28091', 10), // Chuyển chuỗi từ .env thành số nguyên
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Bật tính năng Code-First để tự động tạo bảng
      ssl: {
        rejectUnauthorized: false, // BẮT BUỘC: Cho phép NestJS kết nối bảo mật với Aiven
      },
    }),
    // Người dùng & phân quyền
    UserModule,
    AdminModule,
    AddressModule,
    // Danh mục sản phẩm
    CategoryModule,
    BrandModule,
    ProductModule,
    ProductVariantModule,
    ProductImageModule,
    // Kho hàng
    WarehouseModule,
    InventoryModule,
    // Giỏ hàng
    CartModule,
    CartItemModule,
    // Đơn hàng
    OrderModule,
    OrderItemModule,
    OrderStatusHistoryModule,
    ShipmentModule,
    // Thanh toán
    PaymentModule,
    PaymentTransactionModule,
    // Khuyến mãi & đánh giá
    VoucherModule,
    OrderVoucherModule,
    ReviewModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
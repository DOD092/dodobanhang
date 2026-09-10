import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UnitOfWorkModule } from './common/unit-of-work/unit-of-work.module';
import { getDatabaseConfig } from './config/database.config';
import { HealthController } from './health.controller';
import { AddressModule } from './module/address/address.module';
import { AdminModule } from './module/admin/admin.module';
import { AuthModule } from './module/auth/auth.module';
import { BrandModule } from './module/brand/brand.module';
import { CartItemModule } from './module/cart-item/cart-item.module';
import { CartModule } from './module/cart/cart.module';
import { CustomerModule } from './module/customer/customer.module';
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
import { RoleModule } from './module/role/role.module';
import { ShipmentItemModule } from './module/shipment-item/shipment-item.module';
import { ShipmentModule } from './module/shipment/shipment.module';
import { UserModule } from './module/user/user.module';
import { VoucherModule } from './module/voucher/voucher.module';
import { WarehouseModule } from './module/warehouse/warehouse.module';
import { WarehouseOperatorModule } from './module/warehouse-operator/warehouse-operator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Cấu hình kết nối TypeORM — đọc từ .env qua src/config/database.config.ts
    // (tự bật SSL khi host không phải localhost, vd. Postgres trên Aiven)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UnitOfWorkModule,
    AuthModule,
    // Người dùng & phân quyền
    RoleModule,
    UserModule,
    CustomerModule,
    AdminModule,
    WarehouseOperatorModule,
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
    ShipmentItemModule,
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

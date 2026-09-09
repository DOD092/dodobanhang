import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentItem } from './entities/shipment-item.entity';
import { ShipmentItemController } from './shipment-item.controller';
import { ShipmentItemService } from './shipment-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentItem])], // Dòng này quyết định việc sinh bảng
  controllers: [ShipmentItemController],
  providers: [ShipmentItemService],
  exports: [ShipmentItemService],
})
export class ShipmentItemModule {}

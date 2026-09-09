import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SHIPMENT_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { SHIPMENT_ITEM_SERVICE } from '../../common/dependency-injection/service.tokens';
import { ShipmentItem } from './entities/shipment-item.entity';
import { ShipmentItemController } from './shipment-item.controller';
import { ShipmentItemRepository } from './shipment-item.repository';
import { ShipmentItemService } from './shipment-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentItem])], // Dòng này quyết định việc sinh bảng
  controllers: [ShipmentItemController],
  providers: [
    { provide: SHIPMENT_ITEM_SERVICE, useClass: ShipmentItemService },
    { provide: SHIPMENT_ITEM_REPOSITORY, useClass: ShipmentItemRepository },
  ],
  exports: [SHIPMENT_ITEM_SERVICE],
})
export class ShipmentItemModule {}

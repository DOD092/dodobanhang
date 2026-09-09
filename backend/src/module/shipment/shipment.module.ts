import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SHIPMENT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { SHIPMENT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Shipment } from './entities/shipment.entity';
import { ShipmentController } from './shipment.controller';
import { ShipmentRepository } from './shipment.repository';
import { ShipmentService } from './shipment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])], // Dòng này quyết định việc sinh bảng
  controllers: [ShipmentController],
  providers: [
    { provide: SHIPMENT_SERVICE, useClass: ShipmentService },
    { provide: SHIPMENT_REPOSITORY, useClass: ShipmentRepository },
  ],
  exports: [SHIPMENT_SERVICE],
})
export class ShipmentModule {}

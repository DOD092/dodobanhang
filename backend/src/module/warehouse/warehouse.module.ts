import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WAREHOUSE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { WAREHOUSE_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './warehouse.repository';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])], // Dòng này quyết định việc sinh bảng
  controllers: [WarehouseController],
  providers: [
    { provide: WAREHOUSE_SERVICE, useClass: WarehouseService },
    { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseRepository },
  ],
  exports: [WAREHOUSE_SERVICE],
})
export class WarehouseModule {}

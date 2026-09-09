import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INVENTORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { INVENTORY_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Inventory } from './entities/inventory.entity';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])], // Dòng này quyết định việc sinh bảng
  controllers: [InventoryController],
  providers: [
    { provide: INVENTORY_SERVICE, useClass: InventoryService },
    { provide: INVENTORY_REPOSITORY, useClass: InventoryRepository },
  ],
  exports: [INVENTORY_SERVICE],
})
export class InventoryModule {}

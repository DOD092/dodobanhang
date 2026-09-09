import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOperator } from './entities/warehouse-operator.entity';
import { WarehouseOperatorController } from './warehouse-operator.controller';
import { WarehouseOperatorService } from './warehouse-operator.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseOperator])], // Dòng này quyết định việc sinh bảng
  controllers: [WarehouseOperatorController],
  providers: [WarehouseOperatorService],
  exports: [WarehouseOperatorService],
})
export class WarehouseOperatorModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WAREHOUSE_OPERATOR_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { WAREHOUSE_OPERATOR_SERVICE } from '../../common/dependency-injection/service.tokens';
import { WarehouseOperator } from './entities/warehouse-operator.entity';
import { WarehouseOperatorController } from './warehouse-operator.controller';
import { WarehouseOperatorRepository } from './warehouse-operator.repository';
import { WarehouseOperatorService } from './warehouse-operator.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseOperator])], // Dòng này quyết định việc sinh bảng
  controllers: [WarehouseOperatorController],
  providers: [
    { provide: WAREHOUSE_OPERATOR_SERVICE, useClass: WarehouseOperatorService },
    {
      provide: WAREHOUSE_OPERATOR_REPOSITORY,
      useClass: WarehouseOperatorRepository,
    },
  ],
  exports: [WAREHOUSE_OPERATOR_SERVICE],
})
export class WarehouseOperatorModule {}

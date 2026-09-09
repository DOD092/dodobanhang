import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { WarehouseOperator } from './entities/warehouse-operator.entity';
import { IWarehouseOperatorRepository } from './interface/warehouse-operator-repository.interface';

@Injectable()
export class WarehouseOperatorRepository
  extends BaseRepository<WarehouseOperator>
  implements IWarehouseOperatorRepository
{
  constructor(
    @InjectRepository(WarehouseOperator)
    repository: Repository<WarehouseOperator>,
  ) {
    super(repository, 'WarehouseOperator', 'userId');
  }

  findByUserId(userId: string): Promise<WarehouseOperator | null> {
    return this.repository.findOne({ where: { userId } });
  }
}

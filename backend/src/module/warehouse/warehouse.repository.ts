import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Warehouse } from './entities/warehouse.entity';
import { IWarehouseRepository } from './interface/warehouse-repository.interface';

@Injectable()
export class WarehouseRepository
  extends BaseRepository<Warehouse>
  implements IWarehouseRepository
{
  constructor(
    @InjectRepository(Warehouse)
    repository: Repository<Warehouse>,
  ) {
    super(repository, 'Warehouse');
  }
}

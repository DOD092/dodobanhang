import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Inventory } from './entities/inventory.entity';
import { IInventoryRepository } from './interface/inventory-repository.interface';

@Injectable()
export class InventoryRepository
  extends BaseRepository<Inventory>
  implements IInventoryRepository
{
  constructor(
    @InjectRepository(Inventory)
    repository: Repository<Inventory>,
  ) {
    super(repository, 'Inventory');
  }
}

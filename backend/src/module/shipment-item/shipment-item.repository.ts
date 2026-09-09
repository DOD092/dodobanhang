import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ShipmentItem } from './entities/shipment-item.entity';
import { IShipmentItemRepository } from './interface/shipment-item-repository.interface';

@Injectable()
export class ShipmentItemRepository
  extends BaseRepository<ShipmentItem>
  implements IShipmentItemRepository
{
  constructor(
    @InjectRepository(ShipmentItem)
    repository: Repository<ShipmentItem>,
  ) {
    super(repository, 'ShipmentItem');
  }
}

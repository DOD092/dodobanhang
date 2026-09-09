import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Shipment } from './entities/shipment.entity';
import { IShipmentRepository } from './interface/shipment-repository.interface';

@Injectable()
export class ShipmentRepository
  extends BaseRepository<Shipment>
  implements IShipmentRepository
{
  constructor(
    @InjectRepository(Shipment)
    repository: Repository<Shipment>,
  ) {
    super(repository, 'Shipment');
  }
}

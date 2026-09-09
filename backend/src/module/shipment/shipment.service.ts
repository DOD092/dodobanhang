import { Inject, Injectable } from '@nestjs/common';
import { SHIPMENT_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { IShipmentRepository } from './interface/shipment-repository.interface';
import { IShipmentService } from './interface/shipment-service.interface';

@Injectable()
export class ShipmentService implements IShipmentService {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  create(dto: CreateShipmentDto): Promise<Shipment> {
    return this.shipmentRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Shipment[]> {
    return this.shipmentRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Shipment> {
    return this.shipmentRepository.findOne(id);
  }

  update(id: string, dto: UpdateShipmentDto): Promise<Shipment> {
    return this.shipmentRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.shipmentRepository.remove(id);
  }
}

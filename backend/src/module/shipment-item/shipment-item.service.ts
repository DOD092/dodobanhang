import { Inject, Injectable } from '@nestjs/common';
import { SHIPMENT_ITEM_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import { ShipmentItem } from './entities/shipment-item.entity';
import { IShipmentItemRepository } from './interface/shipment-item-repository.interface';
import { IShipmentItemService } from './interface/shipment-item-service.interface';

@Injectable()
export class ShipmentItemService implements IShipmentItemService {
  constructor(
    @Inject(SHIPMENT_ITEM_REPOSITORY)
    private readonly shipmentItemRepository: IShipmentItemRepository,
  ) {}

  create(dto: CreateShipmentItemDto): Promise<ShipmentItem> {
    return this.shipmentItemRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<ShipmentItem[]> {
    return this.shipmentItemRepository.findAll(pagination);
  }

  findOne(id: string): Promise<ShipmentItem> {
    return this.shipmentItemRepository.findOne(id);
  }

  update(id: string, dto: UpdateShipmentItemDto): Promise<ShipmentItem> {
    return this.shipmentItemRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.shipmentItemRepository.remove(id);
  }
}

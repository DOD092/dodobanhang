import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateShipmentItemDto } from '../dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from '../dto/update-shipment-item.dto';
import { ShipmentItem } from '../entities/shipment-item.entity';

export interface IShipmentItemService {
  create(dto: CreateShipmentItemDto): Promise<ShipmentItem>;
  findAll(pagination: PaginationQueryDto): Promise<ShipmentItem[]>;
  findOne(id: string): Promise<ShipmentItem>;
  update(id: string, dto: UpdateShipmentItemDto): Promise<ShipmentItem>;
  remove(id: string): Promise<void>;
}

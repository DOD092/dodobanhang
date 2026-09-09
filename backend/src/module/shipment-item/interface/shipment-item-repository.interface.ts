import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ShipmentItem } from '../entities/shipment-item.entity';

export interface IShipmentItemRepository {
  create(dto: DeepPartial<ShipmentItem>): Promise<ShipmentItem>;
  findAll(pagination: PaginationQueryDto): Promise<ShipmentItem[]>;
  findOne(id: string): Promise<ShipmentItem>;
  update(id: string, dto: DeepPartial<ShipmentItem>): Promise<ShipmentItem>;
  remove(id: string): Promise<void>;
}

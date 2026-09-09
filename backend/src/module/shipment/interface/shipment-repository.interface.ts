import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Shipment } from '../entities/shipment.entity';

export interface IShipmentRepository {
  create(dto: DeepPartial<Shipment>): Promise<Shipment>;
  findAll(pagination: PaginationQueryDto): Promise<Shipment[]>;
  findOne(id: string): Promise<Shipment>;
  update(id: string, dto: DeepPartial<Shipment>): Promise<Shipment>;
  remove(id: string): Promise<void>;
}

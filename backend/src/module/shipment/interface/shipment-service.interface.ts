import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { Shipment } from '../entities/shipment.entity';

export interface IShipmentService {
  create(dto: CreateShipmentDto): Promise<Shipment>;
  findAll(pagination: PaginationQueryDto): Promise<Shipment[]>;
  findOne(id: string): Promise<Shipment>;
  update(id: string, dto: UpdateShipmentDto): Promise<Shipment>;
  remove(id: string): Promise<void>;
}

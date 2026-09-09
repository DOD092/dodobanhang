import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Warehouse } from '../entities/warehouse.entity';

export interface IWarehouseRepository {
  create(dto: DeepPartial<Warehouse>): Promise<Warehouse>;
  findAll(pagination: PaginationQueryDto): Promise<Warehouse[]>;
  findOne(id: string): Promise<Warehouse>;
  update(id: string, dto: DeepPartial<Warehouse>): Promise<Warehouse>;
  remove(id: string): Promise<void>;
}

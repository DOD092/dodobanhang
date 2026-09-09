import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { Warehouse } from '../entities/warehouse.entity';

export interface IWarehouseService {
  create(dto: CreateWarehouseDto): Promise<Warehouse>;
  findAll(pagination: PaginationQueryDto): Promise<Warehouse[]>;
  findOne(id: string): Promise<Warehouse>;
  update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse>;
  remove(id: string): Promise<void>;
}

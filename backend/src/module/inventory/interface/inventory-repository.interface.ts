import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Inventory } from '../entities/inventory.entity';

export interface IInventoryRepository {
  create(dto: DeepPartial<Inventory>): Promise<Inventory>;
  findAll(pagination: PaginationQueryDto): Promise<Inventory[]>;
  findOne(id: string): Promise<Inventory>;
  update(id: string, dto: DeepPartial<Inventory>): Promise<Inventory>;
  remove(id: string): Promise<void>;
}

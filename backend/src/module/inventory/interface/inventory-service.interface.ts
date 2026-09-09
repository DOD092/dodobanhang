import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { Inventory } from '../entities/inventory.entity';

export interface IInventoryService {
  create(dto: CreateInventoryDto): Promise<Inventory>;
  findAll(pagination: PaginationQueryDto): Promise<Inventory[]>;
  findOne(id: string): Promise<Inventory>;
  update(id: string, dto: UpdateInventoryDto): Promise<Inventory>;
  remove(id: string): Promise<void>;
}

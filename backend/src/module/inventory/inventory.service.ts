import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { IInventoryRepository } from './interface/inventory-repository.interface';
import { IInventoryService } from './interface/inventory-service.interface';

@Injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  create(dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Inventory[]> {
    return this.inventoryRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Inventory> {
    return this.inventoryRepository.findOne(id);
  }

  update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    return this.inventoryRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.inventoryRepository.remove(id);
  }
}

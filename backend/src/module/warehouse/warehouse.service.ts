import { Inject, Injectable } from '@nestjs/common';
import { WAREHOUSE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { IWarehouseRepository } from './interface/warehouse-repository.interface';
import { IWarehouseService } from './interface/warehouse-service.interface';

@Injectable()
export class WarehouseService implements IWarehouseService {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  create(dto: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehouseRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Warehouse[]> {
    return this.warehouseRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Warehouse> {
    return this.warehouseRepository.findOne(id);
  }

  update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    return this.warehouseRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.warehouseRepository.remove(id);
  }
}

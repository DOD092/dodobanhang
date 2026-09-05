import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const entity = this.warehouseRepository.create(dto);
    return await this.warehouseRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Warehouse[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.warehouseRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Warehouse> {
    const entity = await this.warehouseRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Warehouse ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.warehouseRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.warehouseRepository.remove(entity);
  }
}

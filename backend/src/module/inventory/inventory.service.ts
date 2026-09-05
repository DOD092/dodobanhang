import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const entity = this.inventoryRepository.create(dto);
    return await this.inventoryRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Inventory[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.inventoryRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const entity = await this.inventoryRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Inventory ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.inventoryRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.inventoryRepository.remove(entity);
  }
}

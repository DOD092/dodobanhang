import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import { ShipmentItem } from './entities/shipment-item.entity';

@Injectable()
export class ShipmentItemService {
  constructor(
    @InjectRepository(ShipmentItem)
    private readonly shipmentItemRepository: Repository<ShipmentItem>,
  ) {}

  async create(dto: CreateShipmentItemDto): Promise<ShipmentItem> {
    const entity = this.shipmentItemRepository.create(dto);
    return await this.shipmentItemRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<ShipmentItem[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.shipmentItemRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<ShipmentItem> {
    const entity = await this.shipmentItemRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`ShipmentItem ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateShipmentItemDto): Promise<ShipmentItem> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.shipmentItemRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.shipmentItemRepository.remove(entity);
  }
}

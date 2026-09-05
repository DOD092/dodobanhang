import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
  ) {}

  async create(dto: CreateShipmentDto): Promise<Shipment> {
    const entity = this.shipmentRepository.create(dto);
    return await this.shipmentRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Shipment[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.shipmentRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Shipment> {
    const entity = await this.shipmentRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateShipmentDto): Promise<Shipment> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.shipmentRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.shipmentRepository.remove(entity);
  }
}

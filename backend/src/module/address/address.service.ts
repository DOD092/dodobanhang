import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const entity = this.addressRepository.create(dto);
    return await this.addressRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Address[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.addressRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Address> {
    const entity = await this.addressRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateAddressDto): Promise<Address> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.addressRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.addressRepository.remove(entity);
  }
}

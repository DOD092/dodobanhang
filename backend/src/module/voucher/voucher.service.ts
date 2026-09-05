import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  async create(dto: CreateVoucherDto): Promise<Voucher> {
    const entity = this.voucherRepository.create(dto);
    return await this.voucherRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Voucher[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.voucherRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Voucher> {
    const entity = await this.voucherRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Voucher ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateVoucherDto): Promise<Voucher> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.voucherRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.voucherRepository.remove(entity);
  }
}

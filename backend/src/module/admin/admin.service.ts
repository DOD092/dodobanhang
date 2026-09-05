import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    const entity = this.adminRepository.create(dto);
    return await this.adminRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Admin[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.adminRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(userId: string): Promise<Admin> {
    const entity = await this.adminRepository.findOne({ where: { userId } });

    if (!entity) {
      throw new NotFoundException(`Admin ${userId} not found`);
    }

    return entity;
  }

  async update(userId: string, dto: UpdateAdminDto): Promise<Admin> {
    const entity = await this.findOne(userId);
    Object.assign(entity, dto);
    return await this.adminRepository.save(entity);
  }

  async remove(userId: string): Promise<void> {
    const entity = await this.findOne(userId);
    await this.adminRepository.remove(entity);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const entity = this.roleRepository.create(dto);
    return await this.roleRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Role[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.roleRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Role> {
    const entity = await this.roleRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Role ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.roleRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.roleRepository.remove(entity);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const entity = this.userRepository.create(dto);
    return await this.userRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<User[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.userRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.userRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.userRepository.remove(entity);
  }
}

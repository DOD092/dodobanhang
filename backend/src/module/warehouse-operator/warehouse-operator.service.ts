import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';
import { WarehouseOperator } from './entities/warehouse-operator.entity';

@Injectable()
export class WarehouseOperatorService {
  constructor(
    @InjectRepository(WarehouseOperator)
    private readonly warehouseOperatorRepository: Repository<WarehouseOperator>,
  ) {}

  async create(dto: CreateWarehouseOperatorDto): Promise<WarehouseOperator> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.warehouseOperatorRepository.findOne({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new ConflictException(`WarehouseOperator ${dto.userId} already exists`);
    }

    const entity = this.warehouseOperatorRepository.create(dto);
    return await this.warehouseOperatorRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<WarehouseOperator[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.warehouseOperatorRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(userId: string): Promise<WarehouseOperator> {
    const entity = await this.warehouseOperatorRepository.findOne({ where: { userId } });

    if (!entity) {
      throw new NotFoundException(`WarehouseOperator ${userId} not found`);
    }

    return entity;
  }

  async update(userId: string, dto: UpdateWarehouseOperatorDto): Promise<WarehouseOperator> {
    const entity = await this.findOne(userId);
    Object.assign(entity, dto);
    return await this.warehouseOperatorRepository.save(entity);
  }

  async remove(userId: string): Promise<void> {
    const entity = await this.findOne(userId);
    await this.warehouseOperatorRepository.remove(entity);
  }
}

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { WAREHOUSE_OPERATOR_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';
import { WarehouseOperator } from './entities/warehouse-operator.entity';
import { IWarehouseOperatorRepository } from './interface/warehouse-operator-repository.interface';
import { IWarehouseOperatorService } from './interface/warehouse-operator-service.interface';

@Injectable()
export class WarehouseOperatorService implements IWarehouseOperatorService {
  constructor(
    @Inject(WAREHOUSE_OPERATOR_REPOSITORY)
    private readonly warehouseOperatorRepository: IWarehouseOperatorRepository,
  ) {}

  async create(dto: CreateWarehouseOperatorDto): Promise<WarehouseOperator> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.warehouseOperatorRepository.findByUserId(
      dto.userId,
    );

    if (existing) {
      throw new ConflictException(
        `WarehouseOperator ${dto.userId} already exists`,
      );
    }

    return this.warehouseOperatorRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<WarehouseOperator[]> {
    return this.warehouseOperatorRepository.findAll(pagination);
  }

  findOne(userId: string): Promise<WarehouseOperator> {
    return this.warehouseOperatorRepository.findOne(userId);
  }

  update(
    userId: string,
    dto: UpdateWarehouseOperatorDto,
  ): Promise<WarehouseOperator> {
    return this.warehouseOperatorRepository.update(userId, dto);
  }

  remove(userId: string): Promise<void> {
    return this.warehouseOperatorRepository.remove(userId);
  }
}

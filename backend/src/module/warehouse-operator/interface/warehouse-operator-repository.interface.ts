import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { WarehouseOperator } from '../entities/warehouse-operator.entity';

export interface IWarehouseOperatorRepository {
  create(dto: DeepPartial<WarehouseOperator>): Promise<WarehouseOperator>;
  findAll(pagination: PaginationQueryDto): Promise<WarehouseOperator[]>;
  findOne(userId: string): Promise<WarehouseOperator>;
  findByUserId(userId: string): Promise<WarehouseOperator | null>;
  update(
    userId: string,
    dto: DeepPartial<WarehouseOperator>,
  ): Promise<WarehouseOperator>;
  remove(userId: string): Promise<void>;
}

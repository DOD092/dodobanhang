import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateWarehouseOperatorDto } from '../dto/create-warehouse-operator.dto';
import { UpdateWarehouseOperatorDto } from '../dto/update-warehouse-operator.dto';
import { WarehouseOperator } from '../entities/warehouse-operator.entity';

export interface IWarehouseOperatorService {
  create(dto: CreateWarehouseOperatorDto): Promise<WarehouseOperator>;
  findAll(pagination: PaginationQueryDto): Promise<WarehouseOperator[]>;
  findOne(userId: string): Promise<WarehouseOperator>;
  update(
    userId: string,
    dto: UpdateWarehouseOperatorDto,
  ): Promise<WarehouseOperator>;
  remove(userId: string): Promise<void>;
}

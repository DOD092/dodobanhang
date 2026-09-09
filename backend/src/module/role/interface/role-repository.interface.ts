import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Role } from '../entities/role.entity';

export interface IRoleRepository {
  create(dto: DeepPartial<Role>): Promise<Role>;
  findAll(pagination: PaginationQueryDto): Promise<Role[]>;
  findOne(id: string): Promise<Role>;
  update(id: string, dto: DeepPartial<Role>): Promise<Role>;
  remove(id: string): Promise<void>;
}

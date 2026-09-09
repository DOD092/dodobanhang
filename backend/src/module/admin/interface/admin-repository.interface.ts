import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Admin } from '../entities/admin.entity';

export interface IAdminRepository {
  create(dto: DeepPartial<Admin>): Promise<Admin>;
  findAll(pagination: PaginationQueryDto): Promise<Admin[]>;
  findOne(userId: string): Promise<Admin>;
  findByUserId(userId: string): Promise<Admin | null>;
  update(userId: string, dto: DeepPartial<Admin>): Promise<Admin>;
  remove(userId: string): Promise<void>;
}

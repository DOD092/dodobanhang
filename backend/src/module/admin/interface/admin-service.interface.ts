import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { Admin } from '../entities/admin.entity';

export interface IAdminService {
  create(dto: CreateAdminDto): Promise<Admin>;
  findAll(pagination: PaginationQueryDto): Promise<Admin[]>;
  findOne(userId: string): Promise<Admin>;
  update(userId: string, dto: UpdateAdminDto): Promise<Admin>;
  remove(userId: string): Promise<void>;
}

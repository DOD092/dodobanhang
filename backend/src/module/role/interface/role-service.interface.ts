import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';

export interface IRoleService {
  create(dto: CreateRoleDto): Promise<Role>;
  findAll(pagination: PaginationQueryDto): Promise<Role[]>;
  findOne(id: string): Promise<Role>;
  update(id: string, dto: UpdateRoleDto): Promise<Role>;
  remove(id: string): Promise<void>;
}

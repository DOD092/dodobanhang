import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { IRoleRepository } from './interface/role-repository.interface';
import { IRoleService } from './interface/role-service.interface';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  create(dto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Role[]> {
    return this.roleRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne(id);
  }

  update(id: string, dto: UpdateRoleDto): Promise<Role> {
    return this.roleRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.roleRepository.remove(id);
  }
}

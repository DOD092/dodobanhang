import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Role } from './entities/role.entity';
import { IRoleRepository } from './interface/role-repository.interface';

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository, 'Role');
  }
}

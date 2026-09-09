import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Admin } from './entities/admin.entity';
import { IAdminRepository } from './interface/admin-repository.interface';

@Injectable()
export class AdminRepository
  extends BaseRepository<Admin>
  implements IAdminRepository
{
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>,
  ) {
    super(repository, 'Admin', 'userId');
  }

  findByUserId(userId: string): Promise<Admin | null> {
    return this.repository.findOne({ where: { userId } });
  }
}

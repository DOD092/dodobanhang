import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { User } from './entities/user.entity';
import { IUserRepository } from './interface/user-repository.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository, 'User');
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email }, relations: ['role'] });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
      return this.repository.findOne({
        where:{googleId},
        relations:['role'],
      });
  }

  async findAllWithDetails(roleFilter?: string): Promise<User[]>{
    return this.repository.find({
      where:roleFilter ? {role:{name:roleFilter as any}}:{},
      relations:['role','customer'],
      order:{createdAt:'DESC'as any},
    });
  }

  async findByIdWithAllRoles(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['role', 'customer', 'admin', 'warehouseOperator'],
    });
  }
}

import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(dto: DeepPartial<User>): Promise<User>;
  findAll(pagination: PaginationQueryDto): Promise<User[]>;
  findOne(id: string): Promise<User>;
  update(id: string, dto: DeepPartial<User>): Promise<User>;
  remove(id: string): Promise<void>;
}

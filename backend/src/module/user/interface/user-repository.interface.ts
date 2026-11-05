import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { User } from '../entities/user.entity';

export interface UserSearchFilter {
  email?: string;
  phone?: string;
  customerCode?: string;
  employeeCode?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(dto: DeepPartial<User>): Promise<User>;
  findAll(pagination: PaginationQueryDto): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, dto: DeepPartial<User>): Promise<User>;
  remove(id: string): Promise<void>;
  findByGoogleId(googleId:string,): Promise<User|null>;
  findAllWithDetails(roleFilter?: string): Promise<User[]>;
  findByIdWithAllRoles(id: string): Promise<User | null>;
  findByFieldWithAllRoles(filter: UserSearchFilter): Promise<User[]>;
  hardDelete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  updateUserStatus(id: string, status: string): Promise<boolean>;
}

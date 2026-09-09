import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findAll(pagination: PaginationQueryDto): Promise<User[]>;
  findOne(id: string): Promise<User>;
  update(id: string, dto: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<void>;
}

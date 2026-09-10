import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserRepository } from './interface/user-repository.interface';
import { IUserService } from './interface/user-service.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return this.userRepository.create({ ...rest, passwordHash });
  }

  findAll(pagination: PaginationQueryDto): Promise<User[]> {
    return this.userRepository.findAll(pagination);
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { password, ...rest } = dto;
    const passwordHash = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : undefined;
    return this.userRepository.update(id, {
      ...rest,
      ...(passwordHash ? { passwordHash } : {}),
    });
  }

  remove(id: string): Promise<void> {
    return this.userRepository.remove(id);
  }
}

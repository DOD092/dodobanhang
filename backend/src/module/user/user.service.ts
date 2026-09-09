import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserRepository } from './interface/user-repository.interface';
import { IUserService } from './interface/user-service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<User[]> {
    return this.userRepository.findAll(pagination);
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.userRepository.remove(id);
  }
}

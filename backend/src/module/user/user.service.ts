import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserRepository } from './interface/user-repository.interface';
import { IUserService } from './interface/user-service.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AVATAR_URL_PREFIX } from '../../common/upload/avatar-upload.options';
import * as fs from 'fs';
import { join } from 'path';

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

  updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
  const { dateOfBirth, ...rest } = dto;
  return this.userRepository.update(userId, {
    ...rest,
    ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
  });
}

async updateAvatar(userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> {
  if (!file) {
    throw new BadRequestException('Vui lòng chọn ảnh');
  }

  const user = await this.userRepository.findOne(userId);
  const oldUrl = user.avatarUrl;

  const avatarUrl = `${AVATAR_URL_PREFIX}${file.filename}`;
  await this.userRepository.update(userId, { avatarUrl });

  if (oldUrl?.startsWith(AVATAR_URL_PREFIX)) {
    await fs.promises.unlink(join(process.cwd(), oldUrl)).catch(() => {});
  }
  return { avatarUrl };
}

}

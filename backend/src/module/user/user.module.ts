import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { USER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Dòng này quyết định việc sinh bảng
  controllers: [UserController],
  providers: [
    { provide: USER_SERVICE, useClass: UserService },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}

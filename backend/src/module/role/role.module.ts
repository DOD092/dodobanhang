import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ROLE_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ROLE_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { RoleSeeder } from './role.seeder';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // Dòng này quyết định việc sinh bảng
  controllers: [RoleController],
  // RoleSeeder tự nạp 3 role mặc định lúc khởi động (xem role.seeder.ts)
  providers: [
    { provide: ROLE_SERVICE, useClass: RoleService },
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    RoleSeeder,
  ],
  exports: [ROLE_SERVICE],
})
export class RoleModule {}

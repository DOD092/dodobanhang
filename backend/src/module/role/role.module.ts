import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleSeeder } from './role.seeder';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // Dòng này quyết định việc sinh bảng
  controllers: [RoleController],
  // RoleSeeder tự nạp 3 role mặc định lúc khởi động (xem role.seeder.ts)
  providers: [RoleService, RoleSeeder],
  exports: [RoleService],
})
export class RoleModule {}

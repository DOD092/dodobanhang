import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ADMIN_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])], // Dòng này quyết định việc sinh bảng
  controllers: [AdminController],
  providers: [
    { provide: ADMIN_SERVICE, useClass: AdminService },
    { provide: ADMIN_REPOSITORY, useClass: AdminRepository },
  ],
  exports: [ADMIN_SERVICE],
})
export class AdminModule {}

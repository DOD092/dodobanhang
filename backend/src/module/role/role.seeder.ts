import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../../common/enum/role-name.enum';
import { Role } from './entities/role.entity';

/**
 * `roles` là dữ liệu tham chiếu cố định (3 role trong ERD) và `users.role_id`
 * là NOT NULL, nên bảng phải có sẵn dữ liệu thì mới tạo được user.
 * Seeder chạy lúc app khởi động và idempotent — chạy lại không tạo trùng.
 */
@Injectable()
export class RoleSeeder implements OnModuleInit {
  private readonly logger = new Logger(RoleSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit(): Promise<void> {
    const names = Object.values(RoleName);

    const result = await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(names.map((name) => ({ name })))
      .orIgnore() // ON CONFLICT DO NOTHING - dựa vào UNIQUE(name)
      .execute();

    const inserted = result.identifiers.filter(Boolean).length;
    if (inserted > 0) {
      this.logger.log(`Seeded ${inserted} role(s): ${names.join(', ')}`);
    }
  }
}

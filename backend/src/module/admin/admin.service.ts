import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ADMIN_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { IAdminRepository } from './interface/admin-repository.interface';
import { IAdminService } from './interface/admin-service.interface';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.adminRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictException(`Admin ${dto.userId} already exists`);
    }

    return this.adminRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Admin[]> {
    return this.adminRepository.findAll(pagination);
  }

  findOne(userId: string): Promise<Admin> {
    return this.adminRepository.findOne(userId);
  }

  update(userId: string, dto: UpdateAdminDto): Promise<Admin> {
    return this.adminRepository.update(userId, dto);
  }

  remove(userId: string): Promise<void> {
    return this.adminRepository.remove(userId);
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ADMIN_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { USER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { IUserService } from '../user/interface/user-service.interface';
import { AdminProfileResponseDto } from './dto/admin-profile-response.dto';
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
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
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

  async updateMyProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<AdminProfileResponseDto> {
    await this.ensureAdmin(userId);
    await this.userService.updateProfile(userId, dto);
    return this.getProfile(userId);
  }

  async updateMyAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    await this.ensureAdmin(userId);
    return this.userService.updateAvatar(userId, file);
  }

  // Thông tin profile nằm ở bảng users (UserService lo phần ghi); ở đây chỉ
  // chặn trường hợp token hợp lệ nhưng user không có hồ sơ admin.
  private async ensureAdmin(userId: string): Promise<void> {
    const admin = await this.adminRepository.findByUserId(userId);
    if (!admin) {
      throw new NotFoundException('Không tìm thấy hồ sơ admin');
    }
  }

  private async getProfile(userId: string): Promise<AdminProfileResponseDto> {
    const admin = await this.adminRepository.findByUserIdWithUser(userId);
    if (!admin) {
      throw new NotFoundException('Không tìm thấy hồ sơ admin');
    }

    const user = admin.user;
    return {
      id: admin.userId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone ?? undefined,
      avatarUrl: user.avatarUrl,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      employeeCode: admin.employeeCode,
      department: admin.department,
      position: admin.position,
    };
  }
}

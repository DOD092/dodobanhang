import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WAREHOUSE_OPERATOR_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { USER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { IUserService } from '../user/interface/user-service.interface';
import { CreateWarehouseOperatorDto } from './dto/create-warehouse-operator.dto';
import { OperatorProfileResponseDto } from './dto/operator-profile-response.dto';
import { UpdateWarehouseOperatorDto } from './dto/update-warehouse-operator.dto';
import { WarehouseOperator } from './entities/warehouse-operator.entity';
import { IWarehouseOperatorRepository } from './interface/warehouse-operator-repository.interface';
import { IWarehouseOperatorService } from './interface/warehouse-operator-service.interface';

@Injectable()
export class WarehouseOperatorService implements IWarehouseOperatorService {
  constructor(
    @Inject(WAREHOUSE_OPERATOR_REPOSITORY)
    private readonly warehouseOperatorRepository: IWarehouseOperatorRepository,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async create(dto: CreateWarehouseOperatorDto): Promise<WarehouseOperator> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.warehouseOperatorRepository.findByUserId(
      dto.userId,
    );

    if (existing) {
      throw new ConflictException(
        `WarehouseOperator ${dto.userId} already exists`,
      );
    }

    return this.warehouseOperatorRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<WarehouseOperator[]> {
    return this.warehouseOperatorRepository.findAll(pagination);
  }

  findOne(userId: string): Promise<WarehouseOperator> {
    return this.warehouseOperatorRepository.findOne(userId);
  }

  update(
    userId: string,
    dto: UpdateWarehouseOperatorDto,
  ): Promise<WarehouseOperator> {
    return this.warehouseOperatorRepository.update(userId, dto);
  }

  remove(userId: string): Promise<void> {
    return this.warehouseOperatorRepository.remove(userId);
  }

  async updateMyProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<OperatorProfileResponseDto> {
    await this.ensureOperator(userId);
    await this.userService.updateProfile(userId, dto);
    return this.getProfile(userId);
  }

  async updateMyAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    await this.ensureOperator(userId);
    return this.userService.updateAvatar(userId, file);
  }

  // Thông tin profile nằm ở bảng users (UserService lo phần ghi); ở đây chỉ
  // chặn trường hợp token hợp lệ nhưng user không có hồ sơ nhân viên kho.
  private async ensureOperator(userId: string): Promise<void> {
    const operator = await this.warehouseOperatorRepository.findByUserId(userId);
    if (!operator) {
      throw new NotFoundException('Không tìm thấy hồ sơ nhân viên kho');
    }
  }

  private async getProfile(userId: string): Promise<OperatorProfileResponseDto> {
    const operator =
      await this.warehouseOperatorRepository.findByUserIdWithUser(userId);
    if (!operator) {
      throw new NotFoundException('Không tìm thấy hồ sơ nhân viên kho');
    }

    const user = operator.user;
    return {
      id: operator.userId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone ?? undefined,
      avatarUrl: user.avatarUrl,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      employeeCode: operator.employeeCode,
      warehouseId: operator.warehouseId,
      shift: operator.shift,
      status: operator.status,
    };
  }
}

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CUSTOMER_REPOSITORY, USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerByCodeResponseDto } from './dto/get-customer-by-code-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { ICustomerRepository } from './interface/customer-repository.interface';
import { ICustomerService } from './interface/customer-service.interface';
import { IUserRepository } from '../user/interface/user-repository.interface';
import { CustomerProfileResponseDto } from './dto/customer-profile-response.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
  @Inject(CUSTOMER_REPOSITORY)
  private readonly customerRepository: ICustomerRepository,
  @Inject(USER_REPOSITORY)
  private readonly userRepository: IUserRepository,
) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.customerRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictException(`Customer ${dto.userId} already exists`);
    }

    return this.customerRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Customer[]> {
    return this.customerRepository.findAll(pagination);
  }

  findOne(userId: string): Promise<Customer> {
    return this.customerRepository.findOne(userId);
  }

  update(userId: string, dto: UpdateCustomerDto): Promise<Customer> {
    return this.customerRepository.update(userId, dto);
  }

  remove(userId: string): Promise<void> {
    return this.customerRepository.remove(userId);
  }

  async getCustomerByCode(
    customerCode: string,
    currentUser?: any,
  ): Promise<GetCustomerByCodeResponseDto> {
    const customer = await this.customerRepository.findByCodeWithUser(customerCode);

    if (!customer) {
      throw new NotFoundException(`Không tìm thấy khách hàng với mã: ${customerCode}`);
    }

    if (currentUser) {
      const roleName = currentUser.role?.name || currentUser.role;
      const isAdmin = roleName === 'ADMIN';
      const isWarehouse = roleName === 'WAREHOUSE_OPERATOR';
      const isOwner = currentUser.id === customer.userId;

      if (!isAdmin && !isWarehouse && !isOwner) {
        throw new ForbiddenException('Bạn không có quyền xem thông tin khách hàng này');
      }
    }

    const user = customer.user;

    return {
      id: customer.userId,
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone ?? undefined,
      status: user?.status,
      customerCode: customer.customerCode,
      loyaltyPoints: customer.loyaltyPoints ?? 0,
      createdAt: customer.createdAt,
    };
  }

  async updateMyProfile(
  userId: string,
  dto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
  const customer = await this.customerRepository.findByUserId(userId);
  if (!customer) {
    throw new NotFoundException('Không tìm thấy hồ sơ khách hàng');
  }

  // DTO nhận dateOfBirth dạng string '2004-02-09', còn entity là Date,
  // nên tách ra để đổi kiểu, phần còn lại giữ nguyên.
  const { dateOfBirth, ...rest } = dto;
  await this.userRepository.update(userId, {
    ...rest,
    ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
  });

  return this.getProfile(userId);
}

async updateMyAvatar(
  userId: string,
  file: Express.Multer.File,
): Promise<{ avatarUrl: string }> {
  if (!file) {
    throw new BadRequestException('Vui lòng chọn ảnh');
  }

  const user = await this.userRepository.findOne(userId);
  const oldUrl = user.avatarUrl;

  const avatarUrl = `/uploads/avatars/${file.filename}`;
  await this.userRepository.update(userId, { avatarUrl });

  // Xoá ảnh cũ sau khi ghi DB thành công; chỉ xoá file do mình lưu,
  // ảnh từ Google là URL ngoài (https://...) thì bỏ qua.
  if (oldUrl?.startsWith('/uploads/avatars/')) {
    await fs.promises.unlink(join(process.cwd(), oldUrl)).catch(() => {});
  }

  return { avatarUrl };
}

private async getProfile(userId: string): Promise<CustomerProfileResponseDto> {
  const customer = await this.customerRepository.findByUserIdWithUser(userId);
  if (!customer) {
    throw new NotFoundException('Không tìm thấy hồ sơ khách hàng');
  }

  const user = customer.user;
  return {
    id: customer.userId,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone ?? undefined,
    avatarUrl: user.avatarUrl,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    customerCode: customer.customerCode,
    loyaltyPoints: customer.loyaltyPoints,
  };
}

}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerProfileResponseDto } from '../dto/customer-profile-response.dto';   // ← thêm
import { GetCustomerByCodeResponseDto } from '../dto/get-customer-by-code-response.dto';
import { UpdateCustomerProfileDto } from '../dto/update-customer-profile.dto';       // ← thêm
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

export interface ICustomerService {
  create(dto: CreateCustomerDto): Promise<Customer>;
  findAll(pagination: PaginationQueryDto): Promise<Customer[]>;
  findOne(userId: string): Promise<Customer>;
  update(userId: string, dto: UpdateCustomerDto): Promise<Customer>;
  remove(userId: string): Promise<void>;
  getCustomerByCode(
    customerCode: string,
    currentUser: any,
  ): Promise<GetCustomerByCodeResponseDto>;
  updateMyProfile(
    userId: string,
    dto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto>;
  updateMyAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }>;
}   // ← dấu đóng interface phải nằm SAU cùng

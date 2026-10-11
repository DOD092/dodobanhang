import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerByCodeResponseDto } from './dto/get-customer-by-code-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { ICustomerRepository } from './interface/customer-repository.interface';
import { ICustomerService } from './interface/customer-service.interface';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
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
}

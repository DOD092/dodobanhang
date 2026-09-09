import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
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
}

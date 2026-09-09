import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    // Khoá chính do client truyền lên, mà save() với PK đã tồn tại sẽ thành
    // UPDATE — phải chặn trước để POST không âm thầm ghi đè bản ghi cũ.
    const existing = await this.customerRepository.findOne({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new ConflictException(`Customer ${dto.userId} already exists`);
    }

    const entity = this.customerRepository.create(dto);
    return await this.customerRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Customer[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.customerRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(userId: string): Promise<Customer> {
    const entity = await this.customerRepository.findOne({ where: { userId } });

    if (!entity) {
      throw new NotFoundException(`Customer ${userId} not found`);
    }

    return entity;
  }

  async update(userId: string, dto: UpdateCustomerDto): Promise<Customer> {
    const entity = await this.findOne(userId);
    Object.assign(entity, dto);
    return await this.customerRepository.save(entity);
  }

  async remove(userId: string): Promise<void> {
    const entity = await this.findOne(userId);
    await this.customerRepository.remove(entity);
  }
}

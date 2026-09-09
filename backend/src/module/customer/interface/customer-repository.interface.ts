import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  create(dto: DeepPartial<Customer>): Promise<Customer>;
  findAll(pagination: PaginationQueryDto): Promise<Customer[]>;
  findOne(userId: string): Promise<Customer>;
  findByUserId(userId: string): Promise<Customer | null>;
  update(userId: string, dto: DeepPartial<Customer>): Promise<Customer>;
  remove(userId: string): Promise<void>;
}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

export interface ICustomerService {
  create(dto: CreateCustomerDto): Promise<Customer>;
  findAll(pagination: PaginationQueryDto): Promise<Customer[]>;
  findOne(userId: string): Promise<Customer>;
  update(userId: string, dto: UpdateCustomerDto): Promise<Customer>;
  remove(userId: string): Promise<void>;
}

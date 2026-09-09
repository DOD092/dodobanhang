import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Customer } from './entities/customer.entity';
import { ICustomerRepository } from './interface/customer-repository.interface';

@Injectable()
export class CustomerRepository
  extends BaseRepository<Customer>
  implements ICustomerRepository
{
  constructor(
    @InjectRepository(Customer)
    repository: Repository<Customer>,
  ) {
    super(repository, 'Customer', 'userId');
  }

  findByUserId(userId: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { userId } });
  }
}

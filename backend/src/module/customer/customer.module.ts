import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { CUSTOMER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])], // Dòng này quyết định việc sinh bảng
  controllers: [CustomerController],
  providers: [
    { provide: CUSTOMER_SERVICE, useClass: CustomerService },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  ],
  exports: [CUSTOMER_SERVICE],
})
export class CustomerModule {}

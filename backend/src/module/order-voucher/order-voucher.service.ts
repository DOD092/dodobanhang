import { Inject, Injectable } from '@nestjs/common';
import { ORDER_VOUCHER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateOrderVoucherDto } from './dto/create-order-voucher.dto';
import { UpdateOrderVoucherDto } from './dto/update-order-voucher.dto';
import { OrderVoucher } from './entities/order-voucher.entity';
import { IOrderVoucherRepository } from './interface/order-voucher-repository.interface';
import { IOrderVoucherService } from './interface/order-voucher-service.interface';

@Injectable()
export class OrderVoucherService implements IOrderVoucherService {
  constructor(
    @Inject(ORDER_VOUCHER_REPOSITORY)
    private readonly orderVoucherRepository: IOrderVoucherRepository,
  ) {}

  create(dto: CreateOrderVoucherDto): Promise<OrderVoucher> {
    return this.orderVoucherRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<OrderVoucher[]> {
    return this.orderVoucherRepository.findAll(pagination);
  }

  findOne(id: string): Promise<OrderVoucher> {
    return this.orderVoucherRepository.findOne(id);
  }

  update(id: string, dto: UpdateOrderVoucherDto): Promise<OrderVoucher> {
    return this.orderVoucherRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.orderVoucherRepository.remove(id);
  }
}

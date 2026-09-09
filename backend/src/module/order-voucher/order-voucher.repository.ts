import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { OrderVoucher } from './entities/order-voucher.entity';
import { IOrderVoucherRepository } from './interface/order-voucher-repository.interface';

@Injectable()
export class OrderVoucherRepository
  extends BaseRepository<OrderVoucher>
  implements IOrderVoucherRepository
{
  constructor(
    @InjectRepository(OrderVoucher)
    repository: Repository<OrderVoucher>,
  ) {
    super(repository, 'OrderVoucher');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Voucher } from './entities/voucher.entity';
import { IVoucherRepository } from './interface/voucher-repository.interface';

@Injectable()
export class VoucherRepository
  extends BaseRepository<Voucher>
  implements IVoucherRepository
{
  constructor(
    @InjectRepository(Voucher)
    repository: Repository<Voucher>,
  ) {
    super(repository, 'Voucher');
  }
}

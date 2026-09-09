import { Inject, Injectable } from '@nestjs/common';
import { VOUCHER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { IVoucherRepository } from './interface/voucher-repository.interface';
import { IVoucherService } from './interface/voucher-service.interface';

@Injectable()
export class VoucherService implements IVoucherService {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly voucherRepository: IVoucherRepository,
  ) {}

  create(dto: CreateVoucherDto): Promise<Voucher> {
    return this.voucherRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Voucher[]> {
    return this.voucherRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Voucher> {
    return this.voucherRepository.findOne(id);
  }

  update(id: string, dto: UpdateVoucherDto): Promise<Voucher> {
    return this.voucherRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.voucherRepository.remove(id);
  }
}

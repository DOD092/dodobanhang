import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Voucher } from '../entities/voucher.entity';

export interface IVoucherRepository {
  create(dto: DeepPartial<Voucher>): Promise<Voucher>;
  findAll(pagination: PaginationQueryDto): Promise<Voucher[]>;
  findOne(id: string): Promise<Voucher>;
  update(id: string, dto: DeepPartial<Voucher>): Promise<Voucher>;
  remove(id: string): Promise<void>;
}

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { Voucher } from '../entities/voucher.entity';

export interface IVoucherService {
  create(dto: CreateVoucherDto): Promise<Voucher>;
  findAll(pagination: PaginationQueryDto): Promise<Voucher[]>;
  findOne(id: string): Promise<Voucher>;
  update(id: string, dto: UpdateVoucherDto): Promise<Voucher>;
  remove(id: string): Promise<void>;
}

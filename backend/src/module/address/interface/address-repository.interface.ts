import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Address } from '../entities/address.entity';

export interface IAddressRepository {
  create(dto: DeepPartial<Address>): Promise<Address>;
  findAll(pagination: PaginationQueryDto): Promise<Address[]>;
  findOne(id: string): Promise<Address>;
  update(id: string, dto: DeepPartial<Address>): Promise<Address>;
  remove(id: string): Promise<void>;
}

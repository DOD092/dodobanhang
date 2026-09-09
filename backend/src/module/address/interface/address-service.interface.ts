import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/address.entity';

export interface IAddressService {
  create(dto: CreateAddressDto): Promise<Address>;
  findAll(pagination: PaginationQueryDto): Promise<Address[]>;
  findOne(id: string): Promise<Address>;
  update(id: string, dto: UpdateAddressDto): Promise<Address>;
  remove(id: string): Promise<void>;
}

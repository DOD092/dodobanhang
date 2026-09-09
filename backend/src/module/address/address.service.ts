import { Inject, Injectable } from '@nestjs/common';
import { ADDRESS_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { IAddressRepository } from './interface/address-repository.interface';
import { IAddressService } from './interface/address-service.interface';

@Injectable()
export class AddressService implements IAddressService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  create(dto: CreateAddressDto): Promise<Address> {
    return this.addressRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Address[]> {
    return this.addressRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Address> {
    return this.addressRepository.findOne(id);
  }

  update(id: string, dto: UpdateAddressDto): Promise<Address> {
    return this.addressRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.addressRepository.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Address } from './entities/address.entity';
import { IAddressRepository } from './interface/address-repository.interface';

@Injectable()
export class AddressRepository
  extends BaseRepository<Address>
  implements IAddressRepository
{
  constructor(
    @InjectRepository(Address)
    repository: Repository<Address>,
  ) {
    super(repository, 'Address');
  }
}

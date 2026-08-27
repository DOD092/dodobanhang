import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

// Temporary in-memory store: Postgres/TypeORM wiring is paused until a DB is available.
// Swap this out for `@InjectRepository(Address)` once TypeOrmModule is re-enabled in AppModule.
const SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'b3f1c2d4-5678-4abc-9def-1234567890ab',
    userId: 'a1b2c3d4-1111-4aaa-8bbb-000000000001',
    recipientName: 'Nguyen Van A',
    phone: '0901234567',
    street: '123 Nguyen Trai',
    ward: 'Phuong 5',
    district: 'Quan 5',
    city: 'Ho Chi Minh',
    postalCode: '700000',
    country: 'VN',
    isDefault: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  },
];

@Injectable()
export class AddressService {
  private readonly addresses: Address[] = [...SAMPLE_ADDRESSES];

  create(dto: CreateAddressDto): Address {
    const now = new Date();
    const address: Address = {
      id: randomUUID(),
      country: 'VN',
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      ...dto,
    };

    this.addresses.push(address);
    return address;
  }

  findAll(pagination: PaginationQueryDto): Address[] {
    const { page, limit } = pagination;
    const start = (page - 1) * limit;
    return this.addresses.slice(start, start + limit);
  }

  findOne(id: string): Address {
    const address = this.addresses.find((item) => item.id === id);

    if (!address) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    return address;
  }

  update(id: string, dto: UpdateAddressDto): Address {
    const address = this.findOne(id);
    Object.assign(address, dto, { updatedAt: new Date() });
    return address;
  }

  remove(id: string): void {
    const index = this.addresses.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    this.addresses.splice(index, 1);
  }
}

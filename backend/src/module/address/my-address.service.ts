import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import { CreateMyAddressDto } from './dto/create-my-address.dto';
import { Address } from './entities/address.entity';
import { IMyAddressService } from './interface/my-address-service.interface';

const MAX_ADDRESSES_PER_USER = 20;

@Injectable()
export class MyAddressService implements IMyAddressService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly dataSource: DataSource,
  ) {}

  // Địa chỉ mặc định trước, rồi tới địa chỉ thêm gần nhất
  findMine(userId: string): Promise<Address[]> {
    return this.dataSource.getRepository(Address).find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  // Địa chỉ đầu tiên tự thành mặc định; chọn mặc định thì bỏ mặc định của các địa chỉ khác
  createMine(userId: string, dto: CreateMyAddressDto): Promise<Address> {
    return this.unitOfWork.execute(async (manager) => {
      const repo = this.unitOfWork.getRepository(manager, Address);
      const count = await repo.countBy({ userId });
      if (count >= MAX_ADDRESSES_PER_USER) {
        throw new BadRequestException(
          `Mỗi tài khoản tối đa ${MAX_ADDRESSES_PER_USER} địa chỉ.`,
        );
      }
      const isDefault = count === 0 || dto.isDefault === true;
      if (isDefault && count > 0) {
        await repo.update({ userId }, { isDefault: false });
      }
      return repo.save(repo.create({ ...dto, userId, isDefault }));
    });
  }
}

import { CreateMyAddressDto } from '../dto/create-my-address.dto';
import { Address } from '../entities/address.entity';

// Địa chỉ của CHÍNH người đang đăng nhập (userId lấy từ JWT)
export interface IMyAddressService {
  findMine(userId: string): Promise<Address[]>;
  createMine(userId: string, dto: CreateMyAddressDto): Promise<Address>;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { User } from './entities/user.entity';
import {
  IUserRepository,
  UserSearchFilter,
} from './interface/user-repository.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository, 'User');
  }
  // Khác BaseRepository.findOne(): trả null thay vì ném 404, để service tự quyết thông báo lỗi.
  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email }, relations: ['role'] });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
      return this.repository.findOne({
        where:{googleId},
        relations:['role'],
      });
  }

  async findAllWithDetails(roleFilter?: string): Promise<User[]>{
    return this.repository.find({
      where:roleFilter ? {role:{name:roleFilter as any}}:{},
      relations:['role','customer','admin','warehouseOperator'],
      order:{createdAt:'DESC'as any},
    });
  }

  async findByIdWithAllRoles(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['role', 'customer', 'admin', 'warehouseOperator'],
    });
  }

  // Lấy tối đa 2 dòng: đủ để service biết kết quả là 0, 1 hay "nhiều" (trùng
  // phone, hoặc employeeCode trùng giữa admins và warehouse_operators).
  async findByFieldWithAllRoles(filter: UserSearchFilter): Promise<User[]> {
    let where: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    if (filter.email) where = { email: filter.email };
    else if (filter.phone) where = { phone: filter.phone };
    else if (filter.customerCode)
      where = { customer: { customerCode: filter.customerCode } };
    else if (filter.employeeCode)
      // employee_code chỉ UNIQUE trong từng bảng, nên tìm ở cả 2 bảng staff.
      where = [
        { admin: { employeeCode: filter.employeeCode } },
        { warehouseOperator: { employeeCode: filter.employeeCode } },
      ];
    else return [];

    return this.repository.find({
      where,
      relations: ['role', 'customer', 'admin', 'warehouseOperator'],
      take: 2,
    });
  }

  async hardDelete(id: string): Promise<boolean> {
      const result=await this.repository.delete(id);
      return (result.affected??0)>0
  }

  async softDelete(id: string): Promise<boolean>{
    const result= await this.repository.update(id,{
      status:'DELETED' as any,
    })
    return (result.affected??0)>0;
  }

  async updateUserStatus(id: string, status: string): Promise<boolean> {
      const result=await this.repository.update(id,{
        status: status as any,
      })
      return (result.affected ?? 0)>0;
  }
}

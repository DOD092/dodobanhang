import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { User } from './entities/user.entity';
import { IUserRepository } from './interface/user-repository.interface';

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
      relations:['role','customer'],
      order:{createdAt:'DESC'as any},
    });
  }

  async findByIdWithAllRoles(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['role', 'customer', 'admin', 'warehouseOperator'],
    });
  }

  async findByFieldWithAllRoles(filter:{email?: string; phone?:string}):Promise<User | null>{
    const whereCondition: any={};
    if(filter.email) whereCondition.email=filter.email;
    if(filter.phone) whereCondition.phone=filter.phone;
    if(Object.keys(whereCondition).length===0){
      return null;
    }

    return this.repository.findOne({
      where: whereCondition,
      relations:['role','customer','admin','warehouseOperator'],
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

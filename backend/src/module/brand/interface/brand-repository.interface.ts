import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Brand } from '../entities/brand.entity';

export interface IBrandRepository {
  create(dto: DeepPartial<Brand>): Promise<Brand>;
  findAll(pagination: PaginationQueryDto): Promise<Brand[]>;
  findOne(id: string): Promise<Brand>;
  update(id: string, dto: DeepPartial<Brand>): Promise<Brand>;
  remove(id: string): Promise<void>;
}

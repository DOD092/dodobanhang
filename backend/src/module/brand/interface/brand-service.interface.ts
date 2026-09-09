import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Brand } from '../entities/brand.entity';

export interface IBrandService {
  create(dto: CreateBrandDto): Promise<Brand>;
  findAll(pagination: PaginationQueryDto): Promise<Brand[]>;
  findOne(id: string): Promise<Brand>;
  update(id: string, dto: UpdateBrandDto): Promise<Brand>;
  remove(id: string): Promise<void>;
}

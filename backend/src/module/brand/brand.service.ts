import { Inject, Injectable } from '@nestjs/common';
import { BRAND_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { IBrandRepository } from './interface/brand-repository.interface';
import { IBrandService } from './interface/brand-service.interface';

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  create(dto: CreateBrandDto): Promise<Brand> {
    return this.brandRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Brand[]> {
    return this.brandRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Brand> {
    return this.brandRepository.findOne(id);
  }

  update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    return this.brandRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.brandRepository.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Brand } from './entities/brand.entity';
import { IBrandRepository } from './interface/brand-repository.interface';

@Injectable()
export class BrandRepository
  extends BaseRepository<Brand>
  implements IBrandRepository
{
  constructor(
    @InjectRepository(Brand)
    repository: Repository<Brand>,
  ) {
    super(repository, 'Brand');
  }
}

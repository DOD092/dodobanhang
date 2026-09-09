import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Review } from './entities/review.entity';
import { IReviewRepository } from './interface/review-repository.interface';

@Injectable()
export class ReviewRepository
  extends BaseRepository<Review>
  implements IReviewRepository
{
  constructor(
    @InjectRepository(Review)
    repository: Repository<Review>,
  ) {
    super(repository, 'Review');
  }
}

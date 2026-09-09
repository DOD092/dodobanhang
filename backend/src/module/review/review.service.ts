import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { IReviewRepository } from './interface/review-repository.interface';
import { IReviewService } from './interface/review-service.interface';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  create(dto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create(dto);
  }

  findAll(pagination: PaginationQueryDto): Promise<Review[]> {
    return this.reviewRepository.findAll(pagination);
  }

  findOne(id: string): Promise<Review> {
    return this.reviewRepository.findOne(id);
  }

  update(id: string, dto: UpdateReviewDto): Promise<Review> {
    return this.reviewRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.reviewRepository.remove(id);
  }
}

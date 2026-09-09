import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REVIEW_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { REVIEW_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])], // Dòng này quyết định việc sinh bảng
  controllers: [ReviewController],
  providers: [
    { provide: REVIEW_SERVICE, useClass: ReviewService },
    { provide: REVIEW_REPOSITORY, useClass: ReviewRepository },
  ],
  exports: [REVIEW_SERVICE],
})
export class ReviewModule {}

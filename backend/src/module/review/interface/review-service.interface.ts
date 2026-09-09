import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { Review } from '../entities/review.entity';

export interface IReviewService {
  create(dto: CreateReviewDto): Promise<Review>;
  findAll(pagination: PaginationQueryDto): Promise<Review[]>;
  findOne(id: string): Promise<Review>;
  update(id: string, dto: UpdateReviewDto): Promise<Review>;
  remove(id: string): Promise<void>;
}

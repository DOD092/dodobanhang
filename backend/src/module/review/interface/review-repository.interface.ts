import { DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(dto: DeepPartial<Review>): Promise<Review>;
  findAll(pagination: PaginationQueryDto): Promise<Review[]>;
  findOne(id: string): Promise<Review>;
  update(id: string, dto: DeepPartial<Review>): Promise<Review>;
  remove(id: string): Promise<void>;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const entity = this.reviewRepository.create(dto);
    return await this.reviewRepository.save(entity);
  }

  async findAll(pagination: PaginationQueryDto): Promise<Review[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    return await this.reviewRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Review> {
    const entity = await this.reviewRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Review ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.reviewRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.reviewRepository.remove(entity);
  }
}

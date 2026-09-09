import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

/**
 * CRUD dùng chung cho mọi module: create/findAll/findOne/update/remove.
 * Mỗi Service kế thừa lớp này thay vì tự viết lại 5 thao tác giống hệt nhau.
 * `idField` cho phép đổi cột khoá chính (vd. admin/customer/warehouse-operator
 * dùng `userId` thay vì `id`).
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
  protected constructor(
    protected readonly repository: Repository<T>,
    private readonly entityName: string,
    private readonly idField: Extract<keyof T, string> = 'id' as Extract<
      keyof T,
      string
    >,
  ) {}

  create(dto: DeepPartial<T>): Promise<T> {
    return this.repository.save(this.repository.create(dto));
  }

  findAll(pagination: PaginationQueryDto): Promise<T[]> {
    const { page, limit } = pagination;

    return this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<T> {
    const where = { [this.idField]: id } as FindOptionsWhere<T>;
    const entity = await this.repository.findOne({ where });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}

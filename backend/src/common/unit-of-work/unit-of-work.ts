import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

/**
 * Bọc 1 transaction DB dùng chung cho tất cả module. Dùng khi 1 nghiệp vụ
 * phải ghi vào nhiều bảng cùng lúc và cần "tất cả cùng thành công hoặc tất cả
 * cùng rollback" — ví dụ tạo Order thì phải trừ Inventory trong cùng 1 giao dịch.
 *
 * Cách dùng trong 1 Service bất kỳ:
 *
 *   constructor(private readonly unitOfWork: UnitOfWork) {}
 *
 *   async placeOrder(dto: CreateOrderDto) {
 *     return this.unitOfWork.execute(async (manager) => {
 *       const orderRepo = this.unitOfWork.getRepository(manager, Order);
 *       const inventoryRepo = this.unitOfWork.getRepository(manager, Inventory);
 *       const order = await orderRepo.save(orderRepo.create(dto));
 *       await inventoryRepo.decrement({ productVariantId: dto.variantId }, 'quantity', dto.quantity);
 *       return order;
 *     });
 *   }
 */
@Injectable()
export class UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) => work(manager));
  }

  getRepository<Entity extends ObjectLiteral>(
    manager: EntityManager,
    entity: EntityTarget<Entity>,
  ): Repository<Entity> {
    return manager.getRepository(entity);
  }
}

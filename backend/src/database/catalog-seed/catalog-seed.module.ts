import { Module } from '@nestjs/common';
import { CatalogSeeder } from './catalog.seeder';

// Chỉ chạy khi SEED_CATALOG=true (xem catalog.seeder.ts). Entity đã được các
// module category/brand/product... đăng ký, UnitOfWork là @Global().
@Module({ providers: [CatalogSeeder] })
export class CatalogSeedModule {}

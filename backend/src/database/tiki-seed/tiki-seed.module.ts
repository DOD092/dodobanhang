import { Module } from '@nestjs/common';
import { TikiSeeder } from './tiki.seeder';

// Chỉ chạy khi SEED_TIKI=true (xem tiki.seeder.ts). Cần chạy SEED_CATALOG trước để có 5 nhóm.
@Module({ providers: [TikiSeeder] })
export class TikiSeedModule {}

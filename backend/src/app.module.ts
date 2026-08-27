import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AddressModule } from './module/address/address.module';

// Postgres/TypeORM wiring (see src/config/database.config.ts) is paused for now —
// re-add TypeOrmModule.forRootAsync here once a Postgres instance is available.
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AddressModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') ?? 'localhost',
    port: configService.get<number>('DB_PORT') ?? 5432,
    username: configService.get<string>('DB_USERNAME') ?? 'postgres',
    password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
    database: configService.get<string>('DB_NAME') ?? 'dodobanhang',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: nodeEnv !== 'production',
    logging: nodeEnv === 'development',
  };
}

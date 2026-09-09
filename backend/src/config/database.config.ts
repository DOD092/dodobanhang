import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  // DB_DATABASE là tên biến đang dùng trong .env; giữ DB_NAME làm tên cũ tương thích
  const database =
    configService.get<string>('DB_DATABASE') ??
    configService.get<string>('DB_NAME') ??
    'dodobanhang';

  // Postgres host (Aiven, Neon, Supabase...) bắt buộc TLS. Bật mặc định khi
  // host không phải localhost, hoặc ép bằng DB_SSL=true/false.
  const host = configService.get<string>('DB_HOST') ?? 'localhost';
  const sslSetting = configService.get<string>('DB_SSL');
  const useSsl =
    sslSetting !== undefined
      ? sslSetting === 'true'
      : !['localhost', '127.0.0.1'].includes(host);

  return {
    type: 'postgres',
    host,
    port: Number(configService.get<string>('DB_PORT') ?? 5432),
    username: configService.get<string>('DB_USERNAME') ?? 'postgres',
    password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
    database,
    autoLoadEntities: true,
    // Code-first: TypeORM tự tạo/cập nhật bảng. Xem cảnh báo ở CLAUDE.md mục 5 —
    // phải tắt và chuyển sang migration trước khi chạy production thật.
    synchronize: nodeEnv !== 'production',
    logging: nodeEnv === 'development' ? ['error', 'warn'] : false,
    ssl: useSsl
      ? {
          // Aiven dùng CA riêng. Đặt DB_SSL_CA (nội dung file ca.pem) để xác thực
          // đầy đủ; không có thì chấp nhận self-signed để vẫn mã hoá đường truyền.
          rejectUnauthorized: Boolean(configService.get<string>('DB_SSL_CA')),
          ca: configService.get<string>('DB_SSL_CA'),
        }
      : false,
  };
}

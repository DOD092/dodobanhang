import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AUTH_SERVICE } from '../../common/dependency-injection/service.tokens';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthMapper } from './auth.mapper';
import { AuthProfile } from './auth.profile';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CustomerModule } from '../customer/customer.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    UserModule,
    CustomerModule,
    RoleModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') ?? '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE, useClass: AuthService },
    JwtStrategy,
    // Profile phải là provider thì AutomapperModule mới nạp được luật map.
    // AutomapperModule.forRoot() đăng ký global (global: true) nên không
    // cần import lại ở đây, chỉ cần khai báo profile.
    AuthProfile,
    AuthMapper,
  ],
})
export class AuthModule {}

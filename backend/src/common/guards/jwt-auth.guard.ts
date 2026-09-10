import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Bọc AuthGuard('jwt') mặc định của passport để: (1) bỏ qua route đánh dấu
// @Public(), (2) trả lỗi 401 rõ ràng hơn (hết hạn / sai chữ ký / thiếu token).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: Error,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'Token đã hết hạn. Vui lòng đăng nhập lại.',
      );
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token không hợp lệ.');
    }

    if (err || !user) {
      throw err instanceof Error
        ? err
        : new UnauthorizedException('Vui lòng đăng nhập để tiếp tục.');
    }

    return user;
  }
}

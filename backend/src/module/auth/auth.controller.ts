import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AUTH_SERVICE } from '../../common/dependency-injection/service.tokens';
import { LoginDto } from './dto/login.dto';
import { IAuthService } from './interface/auth-service.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email/password, receive a JWT access token',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

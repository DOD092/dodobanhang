import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AUTH_SERVICE } from '../../common/dependency-injection/service.tokens';
import { CustomerRegisterRequestDto } from './dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from './dto/customer-register-response.dto';
import { LoginDto } from './dto/login.dto';
import { IAuthService } from './interface/auth-service.interface';
import { VerifyCustomerEmailDto, VerifyCustomerEmailResponseDto } from './dto/verify-customer-email.dto';
import { ForgotPasswordDto, ForgotPasswordResponseDto } from './dto/forgot-password.dto';
import { ResetPasswordDto, ResetPasswordResponseDto } from './dto/reset-password.dto';@ApiTags('auth')
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

  @Post('register')
  @ApiOperation({
    summary: 'Register as a new customer',
  })
  @ApiCreatedResponse({ type: CustomerRegisterResponseDto })
  @ApiConflictResponse({ description: 'Email đã tồn tại' })
  register(
    @Body() dto: CustomerRegisterRequestDto,
  ): Promise<CustomerRegisterResponseDto> {
    return this.authService.createCustomerRegister(dto);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify customer email',
  })
  verifyEmail(
    @Body() dto: VerifyCustomerEmailDto,
  ): Promise<VerifyCustomerEmailResponseDto> {
    return this.authService.verifyCustomerEmail(dto);
  }

  @Post('resend-verification-code')
  @ApiOperation({
    summary: 'Resend verification code to customer email',
  })
  resendVerificationCode(
    @Body() dto: VerifyCustomerEmailDto,
  ): Promise<VerifyCustomerEmailResponseDto> {
    return this.authService.resendVerificationCode(dto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Send password reset code',
  })
  forgotPassword  (
    @Body() dto:ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto>{
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary:'Reset password'
  })
  resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto>{
    return this.authService.resetPassword(dto);
  }
}

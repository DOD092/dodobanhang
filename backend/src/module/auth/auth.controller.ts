import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { ResetPasswordDto, ResetPasswordResponseDto } from './dto/reset-password.dto';
import { ChangePasswordResponseDto, ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthenticatedUser } from './interface/jwt-payload.interface';
import { RoleName } from 'src/common/enum/role-name.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import {RolesGuard,} from '../../common/guards/roles.guard';
import { CreateStaffAccountDto, CreateStaffAccountResponseDto } from './dto/create-staff-account.dto';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER','WAREHOUSE_OPERATOR','ADMIN',)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({
    summary: 'Change password',
  })
  changePassword(
  @Req() req: { user: AuthenticatedUser },
  @Body() dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.authService.changePassword(
      req.user.id,
      dto,
  );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('staff')
  @ApiOperation({
    summary:'Admin create staff account',
  })
  async createStaffAccount(
    @Body() dto: CreateStaffAccountDto,
  ): Promise<CreateStaffAccountResponseDto> {
    return this.authService.createStaffAccount(dto);
  }
}

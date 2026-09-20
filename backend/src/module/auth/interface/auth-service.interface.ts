import { LoginDto } from '../dto/login.dto';
import { CustomerRegisterRequestDto } from '../dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from '../dto/customer-register-response.dto';
import { VerifyCustomerEmailDto,VerifyCustomerEmailResponseDto } from '../dto/verify-customer-email.dto';
import{ResendVerificationDto,ResendVerificationResponseDto} from '../dto/resend-verification.dto';
import { ForgotPasswordDto, ForgotPasswordResponseDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto,ResetPasswordResponseDto } from '../dto/reset-password.dto';
import { ChangePasswordDto,ChangePasswordResponseDto } from '../dto/change-password.dto';
export interface LoginResult {
  accessToken: string;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<LoginResult>;

  createCustomerRegister(
    dto: CustomerRegisterRequestDto,
  ): Promise<CustomerRegisterResponseDto>;

  verifyCustomerEmail(dto: VerifyCustomerEmailDto,): Promise<VerifyCustomerEmailResponseDto>;

  resendVerificationCode(dto: ResendVerificationDto): Promise<ResendVerificationResponseDto>;

  forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto>;
  
  resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponseDto>;

  changePassword(userId: string,dto: ChangePasswordDto): Promise<ChangePasswordResponseDto>;
}


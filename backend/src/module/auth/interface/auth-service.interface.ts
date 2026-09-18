import { LoginDto } from '../dto/login.dto';
import { CustomerRegisterRequestDto } from '../dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from '../dto/customer-register-response.dto';
import { VerifyCustomerEmailDto,VerifyCustomerEmailResponseDto } from '../dto/verify-customer-email.dto';
import{ResendVerificationDto,ResendVerificationResponseDto} from '../dto/resend-verification.dto';

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
}

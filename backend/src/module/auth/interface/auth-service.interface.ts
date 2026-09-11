import { LoginDto } from '../dto/login.dto';
import { CustomerRegisterRequestDto } from '../dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from '../dto/customer-register-response.dto';

export interface LoginResult {
  accessToken: string;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<LoginResult>;

  createCustomerRegister(
    dto: CustomerRegisterRequestDto,
  ): Promise<CustomerRegisterResponseDto>;
}

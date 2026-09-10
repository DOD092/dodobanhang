import { LoginDto } from '../dto/login.dto';

export interface LoginResult {
  accessToken: string;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<LoginResult>;
}

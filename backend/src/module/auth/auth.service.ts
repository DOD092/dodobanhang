import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { IUserRepository } from '../user/interface/user-repository.interface';
import { LoginDto } from './dto/login.dto';
import { IAuthService, LoginResult } from './interface/auth-service.interface';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    const isMatch =
      user && (await bcrypt.compare(dto.password, user.passwordHash));

    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}

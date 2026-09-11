import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  CUSTOMER_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '../../common/dependency-injection/repository.tokens';
import { RoleName } from '../../common/enum/role-name.enum';
import { UserStatus } from '../../common/enum/user-status.enum';
import { ICustomerRepository } from '../customer/interface/customer-repository.interface';
import { IRoleRepository } from '../role/interface/role-repository.interface';
import { IUserRepository } from '../user/interface/user-repository.interface';
import { CustomerRegisterRequestDto } from './dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from './dto/customer-register-response.dto';
import { LoginDto } from './dto/login.dto';
import { IAuthService, LoginResult } from './interface/auth-service.interface';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
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

  async createCustomerRegister(
    dto: CustomerRegisterRequestDto,
  ): Promise<CustomerRegisterResponseDto> {
    const existedUser = await this.userRepository.findByEmail(dto.email);
    if (existedUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // users.role_id là uuid FK sang bảng roles — phải tra id thật, không hardcode.
    // 3 role do RoleSeeder nạp sẵn lúc app khởi động (xem role.seeder.ts).
    const customerRole = await this.roleRepository.findByName(RoleName.CUSTOMER);
    if (!customerRole) {
      throw new InternalServerErrorException(
        'Chưa có role CUSTOMER trong bảng roles.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.name,
      phone: dto.phone ?? '',
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth,
      roleId: customerRole.id,
      status: UserStatus.ACTIVE,
    });

    const customer = await this.customerRepository.create({
      userId: user.id,
      customerCode: this.generateCustomerCode(),
      loyaltyPoints: 0,
    });

    return {
      userId: user.id,
      customerId: customer.userId,
      customerCode: customer.customerCode,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    };
  }

  /**
   * customers.customer_code là NOT NULL + UNIQUE mà client không truyền lên,
   * nên phải tự sinh. Timestamp giữ thứ tự, 6 ký tự ngẫu nhiên chống trùng khi
   * hai request rơi vào cùng một mili giây. Tổng ~19 ký tự, dưới trần 50.
   */
  private generateCustomerCode(): string {
    const timePart = Date.now().toString(36).toUpperCase();
    const randomPart = randomBytes(3).toString('hex').toUpperCase();
    return `CUS-${timePart}-${randomPart}`;
  }
}

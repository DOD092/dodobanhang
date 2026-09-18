import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomInt } from 'crypto';
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
import { AuthMapper } from './auth.mapper';
import { CustomerRegisterRequestDto } from './dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from './dto/customer-register-response.dto';
import { LoginDto } from './dto/login.dto';
import { IAuthService, LoginResult } from './interface/auth-service.interface';
import { JwtPayload } from './interface/jwt-payload.interface';
import { VerifyCustomerEmailDto, VerifyCustomerEmailResponseDto } from './dto/verify-customer-email.dto';
import {MailService} from '../mail/mail.service';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly jwtService: JwtService,
    private readonly authMapper: AuthMapper,
    private readonly mailService: MailService,
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
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationCode =randomInt(100000, 1000000).toString();

    // users.role_id là uuid FK sang bảng roles — phải tra id thật, không hardcode.
    // 3 role do RoleSeeder nạp sẵn lúc app khởi động (xem role.seeder.ts).
    const customerRole = await this.roleRepository.findByName(
      RoleName.CUSTOMER,
    );
    if (!customerRole) {
      throw new InternalServerErrorException(
        'Chưa có role CUSTOMER trong bảng roles.',
      );
    }

    // TÁCH #1 — RequestDto -> User. 3 field server-only đi qua tham số thứ
    // hai; TypeScript kiểm tra kiểu nhờ UserServerFields (extraArgs trần của
    // AutoMapper là Record<string, unknown>, tự nó không bắt được lỗi gõ sai).
    const user = await this.userRepository.create(
      this.authMapper.toUser(dto, {
        passwordHash: await bcrypt.hash(dto.password, 10),
        roleId: customerRole.id,
        status: UserStatus.INACTIVE,
        verificationCode: verificationCode,
        verificationExpireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      }),
    );

    // TÁCH #2 — RequestDto -> Customer. Không field nào đến từ client.
    const customer = await this.customerRepository.create(
      this.authMapper.toCustomer(dto, {
        userId: user.id,
        customerCode: this.generateCustomerCode(),
      }),
    );

    return this.authMapper.toRegisterResponse(user, customer);
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

  async verifyCustomerEmail(dto: VerifyCustomerEmailDto): Promise<VerifyCustomerEmailResponseDto> {
    const user=await this.userRepository.findByEmail(dto.email);
    if(!user){
      throw new UnauthorizedException('Email không tồn tại.');
    }
    if(user.verificationCode !== dto.verificationCode) {
      throw new UnauthorizedException('Mã xác thực không đúng.');
    }
    if(!user.verificationExpireAt || user.verificationExpireAt < new Date()) {
      throw new UnauthorizedException('Mã xác thực đã hết hạn.');
    }
    await this.userRepository.update(user.id, 
  { status: UserStatus.ACTIVE, verificationCode: null, verificationExpireAt: null });
    return { message: 'Xác thực email thành công.' };
  } 

  async resendVerificationCode(dto: VerifyCustomerEmailDto): Promise<VerifyCustomerEmailResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại.');
    }
    if (user.status === UserStatus.ACTIVE) {
      throw new UnauthorizedException('Tài khoản đã được xác thực.');
    }
    const newVerificationCode = randomInt(100000, 1000000).toString();
    const verificationExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.userRepository.update(user.id, {
      verificationCode: newVerificationCode,
      verificationExpireAt: verificationExpireAt,
    });

    await this.mailService.sendVerificationEmail(user.email, newVerificationCode);
    return { message: 'Mã xác thực mới đã được gửi đến email của bạn.' };
  } 
}


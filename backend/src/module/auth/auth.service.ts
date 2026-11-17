import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MAIL_SERVICE } from '../../common/dependency-injection/service.tokens';
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
import { IMailService } from '../mail/interface/mail-service.interface';
import { ForgotPasswordDto,ForgotPasswordResponseDto } from './dto/forgot-password.dto';
import{ResetPasswordDto, ResetPasswordResponseDto} from './dto/reset-password.dto';
import { ChangePasswordDto, ChangePasswordResponseDto } from './dto/change-password.dto';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthDto, GoogleAuthResponseDto } from './dto/google-auth.dto';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import { Customer } from '../customer/entities/customer.entity';
import { User } from '../user/entities/user.entity';
import { CreateStaffAccountDto, CreateStaffAccountResponseDto } from './dto/create-staff-account.dto';
import { GetUsersQueryDto, UserDetailResponseDto } from './dto/get-users.dto';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { FindUserByFieldQueryDto } from './dto/find-user-by-field.dto';
import { Not } from 'typeorm';
@Injectable()
export class AuthService implements IAuthService {
  // Tạo 1 lần dùng chung: client tự cache public key của Google để verify
  // chữ ký ID token, không phải gọi mạng lại mỗi request.
  private readonly googleClient: OAuth2Client;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly jwtService: JwtService,
    private readonly authMapper: AuthMapper,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    private readonly configService: ConfigService,
    // UnitOfWorkModule là @Global nên inject thẳng, không cần import module.
    private readonly unitOfWork: UnitOfWork,
  ) {
    // client secret + redirect uri chỉ cần cho luồng redirect (getGoogleAuthUrl /
    // googleCallback). Luồng POST /auth/google chỉ cần client id.
    this.googleClient = new OAuth2Client({
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    });
  }

  // Luồng redirect, bước 1: tạo URL trang đăng nhập của Google.
  getGoogleAuthUrl(): string {
    return this.googleClient.generateAuthUrl({
      // Truyền tường minh + getOrThrow: thiếu biến thì báo lỗi ngay ở server,
      // thay vì để Google trả "Missing required parameter: redirect_uri".
      redirect_uri: this.configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['openid', 'email', 'profile'],
      prompt: 'select_account', // luôn hiện màn chọn tài khoản Google
      state: this.signGoogleState(),
    });
  }

  // Luồng redirect, bước 2: Google gọi lại kèm ?code=&state=.
  // Đổi code lấy ID token rồi đi chung đường với POST /auth/google.
  async googleCallback(
    code: string,
    state: string,
  ): Promise<GoogleAuthResponseDto> {
    this.verifyGoogleState(state);

    let idToken: string | null | undefined;
    try {
      const { tokens } = await this.googleClient.getToken(code);
      idToken = tokens.id_token;
    } catch {
      throw new UnauthorizedException('Mã xác thực Google không hợp lệ hoặc đã dùng.');
    }
    if (!idToken) {
      throw new UnauthorizedException('Google không trả về ID token.');
    }
    return this.googleAuth({ credential: idToken });
  }

  // state chống CSRF: chỉ chấp nhận callback có state do chính server ký, còn
  // hạn 10 phút. Ký bằng secret riêng để state không dùng được làm access token.
  private signGoogleState(): string {
    return this.jwtService.sign(
      { nonce: randomBytes(16).toString('hex') },
      { secret: this.googleStateSecret(), expiresIn: '10m' },
    );
  }

  private verifyGoogleState(state: string): void {
    try {
      this.jwtService.verify(state, { secret: this.googleStateSecret() });
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn.');
    }
  }

  private googleStateSecret(): string {
    return `${this.configService.getOrThrow<string>('JWT_SECRET')}:google-oauth-state`;
  }

  /**
   * Đăng nhập / đăng ký customer bằng Google trong cùng 1 endpoint.
   * 3 trường hợp:
   *   1. Đã có user gắn googleId này          -> đăng nhập
   *   2. Có user cùng email nhưng chưa gắn    -> gắn googleId rồi đăng nhập
   *   3. Chưa có gì                           -> tạo user + customer
   */
  async googleAuth(dto: GoogleAuthDto): Promise<GoogleAuthResponseDto> {
    const payload = await this.verifyGoogleToken(dto.credential);
    const googleId = payload.sub;
    const email = payload.email!.toLowerCase();

    let isNewUser = false;
    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(email);
      if (user) {
        // Google đã xác minh email -> chứng minh được người này sở hữu email,
        // nên an toàn khi gắn vào tài khoản đăng ký bằng form trước đó.
        // Nếu tài khoản đang chờ nhập mã xác thực email thì kích hoạt luôn.
        const isPendingVerification =
          user.status === UserStatus.INACTIVE && user.verificationCode !== null;
        await this.userRepository.update(user.id, {
          googleId,
          ...(isPendingVerification && {
            status: UserStatus.ACTIVE,
            verificationCode: null,
            verificationExpireAt: null,
          }),
        });
        user = await this.userRepository.findByGoogleId(googleId);
      } else {
        user = await this.createGoogleCustomer(payload);
        isNewUser = true;
      }
    }

    this.assertCanLogin(user!);

    const jwtPayload: JwtPayload = {
      sub: user!.id,
      email: user!.email,
      role: user!.role.name,
    };

    return {
      accessToken: this.jwtService.sign(jwtPayload),
      isNewUser,
      user: { id: user!.id, email: user!.email, fullName: user!.fullName },
    };
  }

  // KHÔNG được tin email/name client gửi lên — chỉ tin những gì nằm trong
  // ID token đã được verify chữ ký của Google và đúng audience (client id của mình).
  private async verifyGoogleToken(credential: string): Promise<TokenPayload> {
    let ticket: LoginTicket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      });
    } catch {
      throw new UnauthorizedException('Google token không hợp lệ hoặc đã hết hạn.');
    }

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Email Google chưa được xác minh.');
    }
    return payload;
  }

  // users + customers phải cùng thành công hoặc cùng rollback, nên bọc
  // UnitOfWork. Nếu insert customer lỗi mà user đã ghi, lần sau đăng nhập
  // sẽ có user CUSTOMER mà không có profile customer.
  private async createGoogleCustomer(payload: TokenPayload): Promise<User> {
    const customerRole = await this.roleRepository.findByName(RoleName.CUSTOMER);
    if (!customerRole) {
      throw new InternalServerErrorException(
        'Chưa có role CUSTOMER trong bảng roles.',
      );
    }

    await this.unitOfWork.execute(async (manager) => {
      const userRepo = this.unitOfWork.getRepository(manager, User);
      const customerRepo = this.unitOfWork.getRepository(manager, Customer);

      const user = await userRepo.save(
        userRepo.create({
          email: payload.email!.toLowerCase(),
          fullName: payload.name ?? payload.email!,
          avatarUrl: payload.picture,
          googleId: payload.sub,
          passwordHash: null, // tài khoản chỉ đăng nhập bằng Google
          phone: null,
          roleId: customerRole.id,
          // Google đã xác minh email nên không cần bước nhập mã 6 số
          status: UserStatus.ACTIVE,
          verificationCode: null,
          verificationExpireAt: null,
        }),
      );

      await customerRepo.save(
        customerRepo.create({
          userId: user.id,
          customerCode: this.generateCustomerCode(),
        }),
      );
    });

    // Đọc lại sau khi transaction commit để có quan hệ role cho JWT payload.
    return (await this.userRepository.findByGoogleId(payload.sub))!;
  }

  // INACTIVE có 2 nghĩa trong hệ thống: chờ xác thực email (verificationCode
  // còn giá trị — đã xử lý ở trên) và bị admin khoá (verificationCode = null).
  private assertCanLogin(user: User): void {
    const status = user.status as string;
    if (
      status === UserStatus.BLOCKED ||
      status === 'DELETED' ||
      status === UserStatus.INACTIVE
    ) {
      throw new ForbiddenException('Tài khoản đã bị khoá hoặc vô hiệu hoá.');
    }
  }
  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    // passwordHash null = tài khoản chỉ đăng nhập bằng Google. Phải chặn ở đây
    // vì bcrypt.compare(pw, null) NÉM lỗi chứ không trả về false -> 500 thay vì 401.
    const isMatch =
      user?.passwordHash &&
      (await bcrypt.compare(dto.password, user.passwordHash));

    if (!user || !isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    if (user.status === UserStatus.INACTIVE && user.verificationCode) {
      throw new ForbiddenException('Tài khoản chưa xác thực email.');
    }
    this.assertCanLogin(user);

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

    // Tài khoản đã tạo xong -> gửi mail lỗi thì KHÔNG ném 500: nếu ném, user
    // đăng ký lại sẽ dính "Email đã tồn tại". Họ dùng API gửi lại mã để nhận mã mới.
    try {
      await this.mailService.sendVerificationEmail(user.email, verificationCode);
    } catch (error) {
      this.logger.error(`Gửi mã xác thực tới ${user.email} thất bại`, error instanceof Error ? error.stack : String(error));
    }

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

  async forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);// ngon
    if (!user) {
      return { message: 'Nếu email tồn tại, đặt lại mật khẩu đã được gửi' };
    }
    const passwordResetCode=randomInt(100000, 1000000).toString();
    const passwordResetExpireAt=new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepository.update(user.id,{
      passwordResetCode:passwordResetCode,
      passwordResetExpireAt:passwordResetExpireAt,
    })

    await this.mailService.sendPasswordResetEmail(user.email,passwordResetCode);
    return { message: 'Nếu email tồn tại, đặt lại mật khẩu đã được gửi' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Email không tồn tại.',);
    }

    if (user.passwordResetCode !== dto.passwordResetCode){
      throw new BadRequestException('Mã đặt lại mật khẩu không đúng.',);
    }
    
    if (!user.passwordResetExpireAt||user.passwordResetExpireAt<new Date()){
      throw new BadRequestException('Mã đặt lại đã hết hạn.',);
    }
    //hashpassword mới 
    const passwordHash= await bcrypt.hash(dto.newPassword,10);

    await this.userRepository.update(user.id,{
      passwordHash,
      passwordResetCode: null,
      passwordResetExpireAt: null,
    });
    return{
      message:'Đặt lại mật khẩu thành công',
    };
  }
  
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto>{
    const user= await this.userRepository.findOne(userId);
    if(!user){
      throw new NotFoundException('Không tìm thấy tài khoản');
    }
    if (!user.passwordHash) {
      throw new BadRequestException(
        'Tài khoản đăng nhập bằng Google chưa có mật khẩu.',
      );
    }
    const isMatch=await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if(!isMatch){
      throw new BadRequestException('Mật khẩu hiện tại không đúng',)
    }
    const passwordHash=await bcrypt.hash(dto.newPassword,10,);
    await this.userRepository.update(user.id,{passwordHash},);
    return{
      message:'Đổi mật khẩu thành công',
    };
  }

  async createStaffAccount(
    dto: CreateStaffAccountDto,
  ): Promise<CreateStaffAccountResponseDto>{
    if (
      dto.role !== 'ADMIN'&&
      dto.role!=='WAREHOUSE_OPERATOR'
    ){
      throw new BadRequestException('Chỉ được tạo tài khoản ADMIN hoặc WAREHOUSE_OPERATOR',);
    }
    const existedUser=await this.userRepository.findByEmail(dto.email)
    if(existedUser){
      throw new ConflictException('Email đã tồn tại',);
    }

    const roleName = dto.role as RoleName;
    const role=await this.roleRepository.findByName(roleName,);
    if(!role){
      throw new InternalServerErrorException('Không tìm thấy role ${dto.role}.',);
    }
    const passwordHash=await bcrypt.hash(dto.password,10);
    const user=await this.userRepository.create({
      email:dto.email,
      fullName:dto.fullName,
      phone:dto.phone,
      passwordHash,
      roleId:role.id,
      status: UserStatus.ACTIVE,
      verificationCode:null,
      verificationExpireAt: null,
    });
    return{
      id: user.id,
      email:user.email,
      fullName:user.fullName,
      role:dto.role,
    };
  }

  async getAllUsers(query: GetUsersQueryDto): Promise<UserDetailResponseDto[]>{
    const users= await this.userRepository.findAllWithDetails(query.role);
    return users.map((user)=>this.toUserDetail(user));
  }

  async getUserById(
    targetUserId:string,
    currentUser:{id:string,role:string},
  ): Promise<UserDetailResponseDto>{
    const isAdmin=currentUser.role==='ADMIN';
    const isOwner=currentUser.id===targetUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Bạn không có quyền.');
    }

    const user = await this.userRepository.findByIdWithAllRoles(targetUserId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    return this.toUserDetail(user);
  }

  async getUserByField(query: FindUserByFieldQueryDto): Promise<UserDetailResponseDto>{
    const {email, phone, customerCode, employeeCode}=query;
    const filledCount=[email, phone, customerCode, employeeCode].filter(Boolean).length;
    if(filledCount===0){
      throw new BadRequestException('Vui lòng nhập 1 trường để tìm kiếm')
    }
    if(filledCount>1){
      throw new BadRequestException('Chỉ được tìm kiếm theo 1 trường (email, phone, customerCode hoặc employeeCode)');
    }
    const users = await this.userRepository.findByFieldWithAllRoles({ email, phone, customerCode, employeeCode });
    if(users.length===0){
      throw new NotFoundException('Không tìm thấy người dùng phù hợp');
    }
    // phone không UNIQUE dưới DB; employeeCode có thể trùng giữa admin và nhân viên kho.
    if(users.length>1){
      throw new ConflictException('Có nhiều người dùng khớp với giá trị này, vui lòng tìm bằng email hoặc mã khác.');
    }
    return this.toUserDetail(users[0]);
  }

  // Dùng chung cho get all / get by id / search: chỉ gắn block info của đúng
  // role của user, các block còn lại để undefined (không xuất hiện trong JSON).
  private toUserDetail(user: User): UserDetailResponseDto {
    const roleName = user.role?.name;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone ?? undefined,
      role: roleName,
      status: user.status,
      createdAt: user.createdAt,

      customerInfo:
        roleName === RoleName.CUSTOMER && user.customer
          ? {
              customerCode: user.customer.customerCode,
              loyaltyPoints: user.customer.loyaltyPoints ?? 0,
            }
          : undefined,

      adminInfo:
        roleName === RoleName.ADMIN && user.admin
          ? {
              employee_code: user.admin.employeeCode,
              department: user.admin.department,
              position: user.admin.position,
            }
          : undefined,

      operatorInfo:
        roleName === RoleName.WAREHOUSE_OPERATOR && user.warehouseOperator
          ? {
              employee_code: user.warehouseOperator.employeeCode,
              warehouseId: user.warehouseOperator.warehouseId,
              shift: user.warehouseOperator.shift,
              status: user.warehouseOperator.status,
            }
          : undefined,
    };
  }

  async hardDeleteUser(targetUserId: string, currentUserId: string): Promise<{ message: string; }> {
    //tránh admin tự xóa tài khoản bản thân   
    if(targetUserId===currentUserId){
        throw new BadRequestException('Bạn không thể xóa tài khoản của chính mình.');
    }
    const user=await this.userRepository.findById(targetUserId);
    if(!user){
      throw new NotFoundException('Không tìm thấy người dùng cần xóa.');
    }
    const isDeleted=await this.userRepository.hardDelete(targetUserId);
    if(!isDeleted){
      throw new InternalServerErrorException('Xóa người dùng thất bại.');
    }
    return {message:'Đã xóa vĩnh viễn người dùng thành công.'};
  }

  async softDeleteUser(targetUserId: string, currentUserId: string): Promise<{ message: string; }>{
    if(targetUserId === currentUserId){
      throw new BadRequestException('Bạn không thể tự vô hiệu hoá tài khoản của mình.');
    }

    const user = await this.userRepository.findByIdWithAllRoles(targetUserId);
    if(!user){
      throw new NotFoundException('Không tìm thấy người dùng cần xoá.');
    }

    if((user as any).status === 'DELETED'){
      throw new BadRequestException('Tài khoản này đã bị xóa/vô hiệu hóa từ trước.');
    }

    const isUpdated= await this.userRepository.softDelete(targetUserId);
    if(!isUpdated){
      throw new InternalServerErrorException('Xóa người dùng thất bại.');
    }
    return { message: 'Đã vô hiệu hóa (xóa mềm) người dùng thành công.' };
  }

  async inactiveUser(targetUserId:string, currentUserId:string): Promise<{message:string}>{
    if(targetUserId===currentUserId){
      throw new BadRequestException('Bạn không thể tự khoá chính mình.');
    }
    const user=await this.userRepository.findByIdWithAllRoles(targetUserId);
    if(!user){
      throw new NotFoundException('Không tìm thấy người dùng cần khoá.');
    }
    const userAny=user as any;
    const roleName=userAny.role?.name;

    const allowedRoles=['CUSTOMER','WAREHOUSE_OPERATOR'];
    if(!allowedRoles.includes(roleName)){
      throw new BadRequestException('Chỉ được phép khoá tài khoản CUSTOMER hoặc WAREHOUSE_OPERATOR (Tài khoản này có vai trò: ${roleName}).')
    }

    if(userAny.status==='INACTIVE'){
      throw new BadRequestException('Tài khoản này đã được INACTIVE.');
    }
    if(userAny.status==='DELETED'){
      throw new BadRequestException('Tài khoản này đã bị xoá, không thể khoá.');
    }

    const isUpdated= await this.userRepository.updateUserStatus(targetUserId,'INACTIVE');
    if(!isUpdated){
      throw new InternalServerErrorException('Cập nhật trạng thái người dùng thất bại.');
    }
    return { message: `Đã vô hiệu hóa (INACTIVE) tài khoản ${roleName} thành công.` };
  }
}

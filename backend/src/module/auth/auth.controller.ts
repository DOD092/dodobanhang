import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
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
import { GetUsersQueryDto, UserDetailResponseDto } from './dto/get-users.dto';
import { FindUserByFieldQueryDto } from './dto/find-user-by-field.dto';
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

  //Customer xác nhận tài khoản
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

  //Quên mk
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Send password reset code',
  })
  forgotPassword  (
    @Body() dto:ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto>{
    return this.authService.forgotPassword(dto);
  }
  //Confirm quên mk
  @Post('reset-password')
  @ApiOperation({
    summary:'Reset password'
  })
  resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto>{
    return this.authService.resetPassword(dto);
  }


  //Đổi mk
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

  //Tạo tài khoản operator, admin 
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

  //Get all
  @Get('users')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin lấy danh sách user, lọc theo role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:'Danh sách user theo filter',
    type:[UserDetailResponseDto],
  })
  async getAllUsers(
    @Query() query:GetUsersQueryDto,
  ): Promise<UserDetailResponseDto[]>{
    return this.authService.getAllUsers(query)
  }

  //Get by phone, email,...
  @Get('users/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin tìm kiếm User theo 1 trường (email hoặc phone) kèm data theo role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Chưa truyền email hoặc phone',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy người dùng',
  })
  async getUserByField(
    @Query() query: FindUserByFieldQueryDto,
  ): Promise<UserDetailResponseDto> {
    return this.authService.getUserByField(query);
  }

  //Get by id
  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy chi tiết User theo ID (Admin xem tất cả, User chỉ xem chính mình)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin chi tiết user theo role',
    type: UserDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền xem thông tin của người dùng khác',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy người dùng',
  })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<UserDetailResponseDto> {
    return this.authService.getUserById(id, req.user);
  }
  //Get my account
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản đang đăng nhập (Tất cả role)',
    description: 'Không cần truyền tham số, tự động lấy thông tin từ Access Token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin tài khoản kèm dữ liệu theo role tương ứng',
    type: UserDetailResponseDto,
  })
  async getMyAccount(@Req() req: any): Promise<UserDetailResponseDto> {
    return this.authService.getUserById(req.user.id, req.user);
  }

  //hardDelete
  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin xóa vĩnh viễn (Hard Delete) một người dùng theo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy người dùng' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Admin không được tự xóa chính mình' })
  async hardDeleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.authService.hardDeleteUser(id, req.user.id);
  }
}

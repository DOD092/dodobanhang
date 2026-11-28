import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { MY_ADDRESS_SERVICE } from '../../common/dependency-injection/service.tokens';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/interface/jwt-payload.interface';
import { CreateMyAddressDto } from './dto/create-my-address.dto';
import { IMyAddressService } from './interface/my-address-service.interface';

// Địa chỉ giao hàng của CHÍNH người đang đăng nhập (trang thanh toán). userId lấy từ JWT.
@ApiTags('addresses (của tôi)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('addresses/me')
export class MyAddressController {
  constructor(
    @Inject(MY_ADDRESS_SERVICE)
    private readonly myAddressService: IMyAddressService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách địa chỉ của tôi (mặc định trước)' })
  findMine(@Req() req: { user: AuthenticatedUser }) {
    return this.myAddressService.findMine(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm địa chỉ giao hàng' })
  createMine(
    @Req() req: { user: AuthenticatedUser },
    @Body() dto: CreateMyAddressDto,
  ) {
    return this.myAddressService.createMine(req.user.id, dto);
  }
}

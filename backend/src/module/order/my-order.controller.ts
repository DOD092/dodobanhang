import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { MY_ORDER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/interface/jwt-payload.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { IMyOrderService } from './interface/my-order-service.interface';

const assertOrderCode = (orderCode: string) => {
  if (!/^\d{1,20}$/.test(orderCode)) {
    throw new NotFoundException('Không tìm thấy đơn hàng.');
  }
};

// Đặt hàng + xem / huỷ đơn của CHÍNH người đang đăng nhập. userId lấy từ JWT, giá tính ở backend.
@ApiTags('orders (của tôi)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders/me')
export class MyOrderController {
  constructor(
    @Inject(MY_ORDER_SERVICE) private readonly myOrderService: IMyOrderService,
  ) {}

  @Post('checkout')
  @ApiOperation({
    summary:
      'Đặt hàng từ giỏ hiện tại. PAYOS trả checkoutUrl (trang chuyển khoản QR của payOS)',
  })
  checkout(@Req() req: { user: AuthenticatedUser }, @Body() dto: CheckoutDto) {
    return this.myOrderService.checkout(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Đơn hàng của tôi (50 đơn gần nhất)' })
  findMine(@Req() req: { user: AuthenticatedUser }) {
    return this.myOrderService.findMine(req.user.id);
  }

  @Get(':orderCode')
  @ApiOperation({
    summary:
      'Chi tiết 1 đơn của tôi (đơn payOS đang chờ thì đối soát với payOS trước khi trả)',
  })
  findMineByCode(
    @Req() req: { user: AuthenticatedUser },
    @Param('orderCode') orderCode: string,
  ) {
    assertOrderCode(orderCode);
    return this.myOrderService.findMineByCode(req.user.id, orderCode);
  }

  @Post(':orderCode/cancel')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Huỷ đơn chưa xác nhận / chưa thanh toán, hàng trả về giỏ',
  })
  cancelMine(
    @Req() req: { user: AuthenticatedUser },
    @Param('orderCode') orderCode: string,
  ) {
    assertOrderCode(orderCode);
    return this.myOrderService.cancelMine(req.user.id, orderCode);
  }
}

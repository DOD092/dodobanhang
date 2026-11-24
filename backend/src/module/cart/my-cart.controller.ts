import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MY_CART_SERVICE } from '../../common/dependency-injection/service.tokens';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/interface/jwt-payload.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateMyCartItemDto } from './dto/update-cart-item.dto';
import { IMyCartService } from './interface/my-cart-service.interface';

// Giỏ hàng của CHÍNH người đang đăng nhập: userId lấy từ JWT (req.user), không nhận từ client.
// Thiếu/sai/hết hạn token -> 401 "Vui lòng đăng nhập để tiếp tục." (JwtAuthGuard)
@ApiTags('cart (của tôi)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('cart/me')
export class MyCartController {
  constructor(
    @Inject(MY_CART_SERVICE) private readonly myCartService: IMyCartService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Xem giỏ hàng của tôi' })
  getMyCart(@Req() req: { user: AuthenticatedUser }) {
    return this.myCartService.getMyCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Thêm sản phẩm (biến thể) vào giỏ, đã có thì cộng dồn số lượng',
  })
  addItem(@Req() req: { user: AuthenticatedUser }, @Body() dto: AddToCartDto) {
    return this.myCartService.addItem(req.user.id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Đặt lại số lượng 1 dòng trong giỏ của tôi (1-99)' })
  updateItem(
    @Req() req: { user: AuthenticatedUser },
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateMyCartItemDto,
  ) {
    return this.myCartService.updateItem(req.user.id, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Xoá 1 dòng khỏi giỏ của tôi' })
  removeItem(
    @Req() req: { user: AuthenticatedUser },
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.myCartService.removeItem(req.user.id, itemId);
  }
}

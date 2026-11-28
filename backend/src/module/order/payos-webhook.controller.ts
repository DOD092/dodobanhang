import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { PayOSError, type Webhook } from '@payos/node';
import { MY_ORDER_SERVICE } from '../../common/dependency-injection/service.tokens';
import { IMyOrderService } from './interface/my-order-service.interface';

/*
  payOS gọi khi có giao dịch: POST /api/payments/payos/webhook. CÔNG KHAI (không JWT), bảo vệ
  bằng chữ ký (PAYOS_CHECKSUM_KEY) - sai chữ ký -> 400, không đổi gì trong DB.
  Khai URL này ở my.payos.vn -> Kênh thanh toán -> Webhook (cần URL công khai: tunnel khi dev).
  Body là kiểu TS (không phải class) nên ValidationPipe bỏ qua, nhận nguyên body của payOS.
*/
@ApiTags('payos')
@Controller('payments/payos')
export class PayosWebhookController {
  private readonly logger = new Logger(PayosWebhookController.name);

  constructor(
    @Inject(MY_ORDER_SERVICE) private readonly myOrderService: IMyOrderService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async webhook(@Body() body: Webhook) {
    try {
      await this.myOrderService.handlePayosWebhook(body);
    } catch (error) {
      if (error instanceof PayOSError) {
        this.logger.warn(`Webhook payOS không hợp lệ: ${error.message}`);
        throw new BadRequestException('Invalid webhook');
      }
      throw error; // lỗi DB... -> 500, payOS sẽ gửi lại sau
    }
    return { success: true };
  }
}

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  type CreatePaymentLinkRequest,
  type CreatePaymentLinkResponse,
  type PaymentLink,
  PayOS,
  type Webhook,
  type WebhookData,
} from '@payos/node';
import { IPayosService } from './interface/payos-service.interface';

/*
  Khoá lấy từ .env: PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY (my.payos.vn -> Kênh thanh toán).
  Khởi tạo SDK lúc dùng lần đầu, KHÔNG lúc boot: máy chưa có khoá (thành viên khác trong nhóm) vẫn
  chạy app bình thường, chỉ chức năng chuyển khoản báo 503.
*/
@Injectable()
export class PayosService implements IPayosService {
  private client: PayOS | null = null;

  constructor(private readonly config: ConfigService) {}

  private get payos(): PayOS {
    if (this.client) return this.client;
    const clientId = this.config.get<string>('PAYOS_CLIENT_ID');
    const apiKey = this.config.get<string>('PAYOS_API_KEY');
    const checksumKey = this.config.get<string>('PAYOS_CHECKSUM_KEY');
    if (!clientId || !apiKey || !checksumKey) {
      throw new ServiceUnavailableException(
        'Thanh toán chuyển khoản chưa được cấu hình, vui lòng chọn COD.',
      );
    }
    this.client = new PayOS({ clientId, apiKey, checksumKey });
    return this.client;
  }

  createPaymentLink(
    data: CreatePaymentLinkRequest,
  ): Promise<CreatePaymentLinkResponse> {
    return this.payos.paymentRequests.create(data);
  }

  getPaymentLink(orderCode: number): Promise<PaymentLink> {
    return this.payos.paymentRequests.get(orderCode);
  }

  cancelPaymentLink(orderCode: number, reason?: string): Promise<PaymentLink> {
    return this.payos.paymentRequests.cancel(orderCode, reason);
  }

  verifyWebhook(body: Webhook): Promise<WebhookData> {
    return this.payos.webhooks.verify(body);
  }
}

import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  PaymentLink,
  Webhook,
  WebhookData,
} from '@payos/node';

// Bọc SDK payOS để service nghiệp vụ không phụ thuộc thẳng vào thư viện (dễ mock khi test)
export interface IPayosService {
  createPaymentLink(
    data: CreatePaymentLinkRequest,
  ): Promise<CreatePaymentLinkResponse>;
  getPaymentLink(orderCode: number): Promise<PaymentLink>;
  cancelPaymentLink(orderCode: number, reason?: string): Promise<PaymentLink>;
  // Sai chữ ký / dữ liệu lạ -> ném lỗi
  verifyWebhook(body: Webhook): Promise<WebhookData>;
}

import type { Webhook } from '@payos/node';
import { OrderStatus } from '../../../common/enum/order-status.enum';
import { PaymentStatus } from '../../../common/enum/payment.enum';
import { CheckoutDto, CheckoutPaymentMethod } from '../dto/checkout.dto';

export interface CheckoutResultDto {
  orderCode: string;
  totalAmount: number;
  paymentMethod: CheckoutPaymentMethod;
  // Link trang thanh toán payOS (chỉ khi paymentMethod = PAYOS); COD -> null
  checkoutUrl: string | null;
}

export interface MyOrderSummaryDto {
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: CheckoutPaymentMethod;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
}

export interface MyOrderDetailDto extends MyOrderSummaryDto {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  customerNote: string | null;
  orderAddress: string;
  // Hạn chuyển khoản payOS khi còn chờ thanh toán; đã trả / COD -> null
  paymentExpiredAt: Date | null;
  items: {
    productName: string;
    variantName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
  }[];
}

// Đơn hàng của CHÍNH người đang đăng nhập (userId lấy từ JWT)
export interface IMyOrderService {
  checkout(userId: string, dto: CheckoutDto): Promise<CheckoutResultDto>;
  findMine(userId: string): Promise<MyOrderSummaryDto[]>;
  findMineByCode(userId: string, orderCode: string): Promise<MyOrderDetailDto>;
  // Huỷ đơn chưa xác nhận / chưa thanh toán, hàng trả về giỏ
  cancelMine(userId: string, orderCode: string): Promise<MyOrderDetailDto>;
  // Webhook payOS (đã verify chữ ký bên trong)
  handlePayosWebhook(body: Webhook): Promise<void>;
}

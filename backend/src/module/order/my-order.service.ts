import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Webhook } from '@payos/node';
import { randomInt } from 'crypto';
import { DataSource, EntityManager, In } from 'typeorm';
import { PAYOS_SERVICE } from '../../common/dependency-injection/service.tokens';
import { CartStatus } from '../../common/enum/cart-status.enum';
import { OrderStatus } from '../../common/enum/order-status.enum';
import {
  PaymentMethod,
  PaymentStatus,
  TransactionType,
} from '../../common/enum/payment.enum';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import { Address } from '../address/entities/address.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { MAX_CART_QUANTITY } from '../cart/dto/add-to-cart.dto';
import { Cart } from '../cart/entities/cart.entity';
import { CART_LOCK_NAMESPACE } from '../cart/my-cart.service';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { OrderStatusHistory } from '../order-status-history/entities/order-status-history.entity';
import { PaymentTransaction } from '../payment-transaction/entities/payment-transaction.entity';
import { Payment } from '../payment/entities/payment.entity';
import { IPayosService } from '../payos/interface/payos-service.interface';
import { PUBLIC_STATUS } from '../product/product.constants';
import { CheckoutDto, CheckoutPaymentMethod } from './dto/checkout.dto';
import { Order } from './entities/order.entity';
import {
  CheckoutResultDto,
  IMyOrderService,
  MyOrderDetailDto,
  MyOrderSummaryDto,
} from './interface/my-order-service.interface';

export const PAYOS_PROVIDER = 'PAYOS';
const PAYMENT_TTL_MS = 15 * 60 * 1000; // link chuyển khoản payOS hết hạn sau 15 phút

// Mã đơn = chuỗi số vì payOS bắt buộc orderCode là số nguyên dương, duy nhất, <= 2^53.
// ms hiện tại x100 + 2 số ngẫu nhiên (~1.8e14). Trùng (rất hiếm) thì UNIQUE(order_code) chặn -> 409.
function generateOrderCode(): string {
  return String(Date.now() * 100 + randomInt(100));
}

function formatAddress(a: Address): string {
  const place = [a.addressLine, a.ward, a.district, a.province]
    .filter(Boolean)
    .join(', ');
  return `${a.receiverName} - ${a.receiverPhone} - ${place}`;
}

const toMethod = (payment?: Payment | null): CheckoutPaymentMethod =>
  payment?.provider === PAYOS_PROVIDER ? 'PAYOS' : 'COD';

const latestPayment = (manager: EntityManager, orderId: string) =>
  manager.getRepository(Payment).findOne({
    where: { orderId },
    order: { createdAt: 'DESC' },
  });

interface PaidInfo {
  amount: number;
  reference: string;
  code: string;
}

@Injectable()
export class MyOrderService implements IMyOrderService {
  private readonly logger = new Logger(MyOrderService.name);

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    @Inject(PAYOS_SERVICE) private readonly payos: IPayosService,
  ) {}

  // ---------------------------------------------------------------- đặt hàng

  async checkout(userId: string, dto: CheckoutDto): Promise<CheckoutResultDto> {
    const isPayos = dto.paymentMethod === 'PAYOS';
    const expiredAt = new Date(Date.now() + PAYMENT_TTL_MS);

    const { order, items, address } = await this.unitOfWork.execute(
      async (manager) => {
        // Cùng khoá với lúc thêm vào giỏ: bấm "Đặt hàng" 2 lần / thêm hàng ở tab khác trong lúc
        // đặt sẽ phải chờ, lần sau thấy giỏ đã CHECKED_OUT -> báo giỏ trống, không tạo 2 đơn.
        await this.lockCart(manager, userId);

        const cart = await manager.getRepository(Cart).findOne({
          where: { userId, status: CartStatus.ACTIVE },
          order: { createdAt: 'ASC' },
        });
        const cartItems = cart
          ? await manager.getRepository(CartItem).find({
              where: { cartId: cart.id },
              relations: { variant: { product: true } },
              order: { createdAt: 'ASC' },
            })
          : [];
        if (!cart || cartItems.length === 0) {
          throw new BadRequestException('Giỏ hàng của bạn đang trống.');
        }

        // Giá và trạng thái đọc lại từ DB lúc đặt, không dùng giá cũ lưu trong giỏ
        for (const { variant } of cartItems) {
          if (
            variant.product.status !== PUBLIC_STATUS ||
            variant.price === null
          ) {
            throw new BadRequestException(
              `"${variant.product.name}" đã ngừng bán hoặc chưa có giá, vui lòng xoá khỏi giỏ.`,
            );
          }
        }

        const address = await manager
          .getRepository(Address)
          .findOneBy({ id: dto.addressId, userId });
        if (!address) {
          throw new NotFoundException('Không tìm thấy địa chỉ giao hàng.');
        }

        const subtotal = cartItems.reduce(
          (sum, { variant, quantity }) => sum + variant.price! * quantity,
          0,
        );
        const shippingFee = 0; // chưa tính phí vận chuyển
        const totalAmount = subtotal + shippingFee;

        const orderRepo = manager.getRepository(Order);
        const order = await orderRepo.save(
          orderRepo.create({
            orderCode: generateOrderCode(),
            userId,
            shippingAddressId: address.id,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            subtotal,
            discountAmount: 0,
            shippingFee,
            taxAmount: 0,
            totalAmount,
            customerNote: dto.customerNote?.trim() || undefined,
            orderAddress: formatAddress(address), // bản chụp, sửa địa chỉ sau không đổi đơn cũ
          }),
        );

        const itemRepo = manager.getRepository(OrderItem);
        const items = await itemRepo.save(
          cartItems.map(({ variant, quantity }) =>
            itemRepo.create({
              orderId: order.id,
              variantId: variant.id,
              productName: variant.product.name.slice(0, 200),
              variantName: variant.variantName.slice(0, 200),
              sku: variant.sku,
              quantity,
              unitPrice: variant.price!,
            }),
          ),
        );

        const paymentRepo = manager.getRepository(Payment);
        await paymentRepo.save(
          paymentRepo.create({
            orderId: order.id,
            // payOS là chuyển khoản ngân hàng qua VietQR: không cần thêm giá trị enum mới
            paymentMethod: isPayos
              ? PaymentMethod.BANK_TRANSFER
              : PaymentMethod.COD,
            provider: isPayos ? PAYOS_PROVIDER : undefined,
            amount: totalAmount,
            status: PaymentStatus.PENDING,
            expiredAt: isPayos ? expiredAt : undefined,
          }),
        );

        await this.addHistory(manager, {
          orderId: order.id,
          toStatus: OrderStatus.PENDING,
          changedBy: userId,
          note: 'Khách đặt hàng',
        });

        await manager
          .getRepository(Cart)
          .update(cart.id, { status: CartStatus.CHECKED_OUT });

        return { order, items, address };
      },
    );

    const result: CheckoutResultDto = {
      orderCode: order.orderCode,
      totalAmount: order.totalAmount,
      paymentMethod: dto.paymentMethod,
      checkoutUrl: null,
    };
    if (!isPayos) return result;

    // Gọi payOS SAU khi transaction đã commit (không giữ khoá DB trong lúc chờ API ngoài)
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3001';
    const resultUrl = `${frontendUrl}/checkout/result?orderCode=${order.orderCode}`;
    try {
      const link = await this.payos.createPaymentLink({
        orderCode: Number(order.orderCode),
        amount: Math.round(order.totalAmount),
        // Nội dung chuyển khoản: payOS giới hạn 9 ký tự với tài khoản không liên kết qua payOS
        description: `DH${order.orderCode.slice(-7)}`,
        items: items.map((item) => ({
          name: item.productName.slice(0, 100),
          quantity: item.quantity,
          price: Math.round(item.unitPrice),
        })),
        buyerName: address.receiverName,
        buyerPhone: address.receiverPhone,
        returnUrl: resultUrl,
        cancelUrl: `${resultUrl}&cancel=1`,
        expiredAt: Math.floor(expiredAt.getTime() / 1000),
      });
      return { ...result, checkoutUrl: link.checkoutUrl };
    } catch (error) {
      // Không tạo được link: huỷ đơn vừa tạo và trả hàng về giỏ để khách đặt lại / chọn COD
      this.logger.error(
        `Tạo link payOS thất bại cho đơn ${order.orderCode}`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.unitOfWork.execute((manager) =>
        this.cancelInTx(manager, order.id, 'Không tạo được link payOS', null),
      );
      if (error instanceof HttpException) throw error; // vd 503 chưa cấu hình khoá
      throw new BadGatewayException(
        'Không tạo được link thanh toán, giỏ hàng vẫn được giữ nguyên. Vui lòng thử lại hoặc chọn COD.',
      );
    }
  }

  // ---------------------------------------------------------------- xem đơn

  async findMine(userId: string): Promise<MyOrderSummaryDto[]> {
    const orders = await this.dataSource.getRepository(Order).find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    if (orders.length === 0) return [];
    const ids = orders.map((o) => o.id);
    const [items, payments] = await Promise.all([
      this.dataSource
        .getRepository(OrderItem)
        .find({ where: { orderId: In(ids) } }),
      this.dataSource.getRepository(Payment).find({
        where: { orderId: In(ids) },
        order: { createdAt: 'DESC' },
      }),
    ]);
    return orders.map((order) =>
      this.toSummary(
        order,
        items.filter((i) => i.orderId === order.id),
        payments.find((p) => p.orderId === order.id),
      ),
    );
  }

  async findMineByCode(
    userId: string,
    orderCode: string,
  ): Promise<MyOrderDetailDto> {
    let order = await this.findOwnOrder(userId, orderCode);
    let payment = await latestPayment(this.dataSource.manager, order.id);

    // Đơn payOS chưa có kết quả: hỏi thẳng payOS (webhook có thể chưa tới, nhất là khi chạy local
    // không có tunnel). Lỗi mạng thì bỏ qua, hiện trạng thái đang có.
    if (this.isAwaitingPayos(order, payment)) {
      await this.reconcileWithPayos(order).catch((error) =>
        this.logger.warn(
          `Đối soát payOS đơn ${order.orderCode} lỗi: ${String(error)}`,
        ),
      );
      order = await this.findOwnOrder(userId, orderCode);
      payment = await latestPayment(this.dataSource.manager, order.id);
    }

    const items = await this.dataSource
      .getRepository(OrderItem)
      .find({ where: { orderId: order.id } });

    return {
      ...this.toSummary(order, items, payment),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      customerNote: order.customerNote ?? null,
      orderAddress: order.orderAddress,
      paymentExpiredAt:
        payment?.status === PaymentStatus.PENDING
          ? (payment.expiredAt ?? null)
          : null,
      items: items.map((i) => ({
        productName: i.productName,
        variantName: i.variantName,
        sku: i.sku,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
    };
  }

  // ---------------------------------------------------------------- huỷ đơn

  async cancelMine(
    userId: string,
    orderCode: string,
  ): Promise<MyOrderDetailDto> {
    const order = await this.findOwnOrder(userId, orderCode);
    if (order.status === OrderStatus.CANCELLED) {
      return this.findMineByCode(userId, orderCode);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException(
        'Đơn đã được xác nhận, vui lòng liên hệ cửa hàng để huỷ.',
      );
    }

    const payment = await latestPayment(this.dataSource.manager, order.id);
    if (this.isAwaitingPayos(order, payment)) {
      // Khách có thể vừa chuyển khoản xong: hỏi payOS trước, đã trả thì không cho huỷ
      const link = await this.payos.getPaymentLink(Number(order.orderCode));
      if (link.status === 'PAID') {
        await this.markPaid(order.orderCode, {
          amount: link.amountPaid,
          reference: link.transactions[0]?.reference ?? link.id,
          code: '00',
        });
        throw new ConflictException(
          'Đơn đã được thanh toán, vui lòng liên hệ cửa hàng để huỷ.',
        );
      }
      if (link.status === 'PENDING' || link.status === 'PROCESSING') {
        await this.payos.cancelPaymentLink(
          Number(order.orderCode),
          'Khách huỷ đơn',
        );
      }
    }

    await this.unitOfWork.execute((manager) =>
      this.cancelInTx(manager, order.id, 'Khách huỷ đơn', userId),
    );
    return this.findMineByCode(userId, orderCode);
  }

  // ---------------------------------------------------------------- payOS

  // Webhook payOS: verify chữ ký bằng checksum key (sai -> ném lỗi -> 400). Gọi lại nhiều lần
  // cho cùng 1 giao dịch vẫn an toàn (markPaid idempotent).
  async handlePayosWebhook(body: Webhook): Promise<void> {
    const data = await this.payos.verifyWebhook(body);
    if (data.code !== '00') {
      this.logger.warn(
        `Webhook payOS đơn ${data.orderCode} không thành công: ${data.code} ${data.desc}`,
      );
      return;
    }
    await this.markPaid(String(data.orderCode), {
      amount: data.amount,
      reference: data.reference,
      code: data.code,
    });
  }

  private async reconcileWithPayos(order: Order): Promise<void> {
    const link = await this.payos.getPaymentLink(Number(order.orderCode));
    if (link.status === 'PAID') {
      await this.markPaid(order.orderCode, {
        amount: link.amountPaid,
        reference: link.transactions[0]?.reference ?? link.id,
        code: '00',
      });
    } else if (link.status === 'CANCELLED' || link.status === 'EXPIRED') {
      await this.unitOfWork.execute((manager) =>
        this.cancelInTx(
          manager,
          order.id,
          link.status === 'EXPIRED'
            ? 'Hết hạn thanh toán payOS'
            : 'Khách huỷ thanh toán trên payOS',
          null,
        ),
      );
    }
  }

  // Ghi nhận đã nhận tiền. Khoá dòng order để webhook + đối soát chạy cùng lúc không ghi 2 lần.
  private async markPaid(orderCode: string, info: PaidInfo): Promise<void> {
    await this.unitOfWork.execute(async (manager) => {
      const order = await manager.getRepository(Order).findOne({
        where: { orderCode },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) {
        // payOS gửi request thử (orderCode mẫu) khi khai báo webhook -> bỏ qua, vẫn trả 200
        this.logger.warn(`payOS báo đơn ${orderCode} không có trong DB`);
        return;
      }
      const payment = await latestPayment(manager, order.id);
      if (!payment || payment.provider !== PAYOS_PROVIDER) {
        this.logger.warn(`Đơn ${orderCode} không thanh toán qua payOS`);
        return;
      }
      if (payment.status === PaymentStatus.SUCCESS) return; // đã ghi nhận rồi

      const txRepo = manager.getRepository(PaymentTransaction);
      const enough = Math.round(info.amount) >= Math.round(order.totalAmount);
      await txRepo.save(
        txRepo.create({
          paymentId: payment.id,
          providerTransactionId: info.reference.slice(0, 100),
          transactionType: TransactionType.PAYMENT,
          amount: info.amount,
          status: enough ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          responseCode: info.code.slice(0, 50),
        }),
      );
      if (!enough) {
        this.logger.warn(
          `Đơn ${orderCode} chuyển thiếu: nhận ${info.amount}, cần ${order.totalAmount}`,
        );
        return;
      }

      const now = new Date();
      await manager
        .getRepository(Payment)
        .update(payment.id, { status: PaymentStatus.SUCCESS, paidAt: now });

      if (order.status === OrderStatus.CANCELLED) {
        // Tiền tới sau khi đơn đã huỷ (hết hạn / khách huỷ đúng lúc chuyển): giữ đơn huỷ,
        // đánh dấu đã nhận tiền để cửa hàng hoàn tiền thủ công
        await manager
          .getRepository(Order)
          .update(order.id, { paymentStatus: PaymentStatus.SUCCESS });
        await this.addHistory(manager, {
          orderId: order.id,
          fromStatus: OrderStatus.CANCELLED,
          toStatus: OrderStatus.CANCELLED,
          note: `Nhận ${info.amount}đ qua payOS sau khi đơn đã huỷ - cần hoàn tiền`,
        });
        this.logger.warn(`Đơn ${orderCode} đã huỷ nhưng nhận được tiền`);
        return;
      }

      await manager.getRepository(Order).update(order.id, {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.SUCCESS,
        confirmedAt: now,
      });
      await this.addHistory(manager, {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: OrderStatus.CONFIRMED,
        note: `Đã thanh toán qua payOS (${info.reference})`,
      });
    });
  }

  // ---------------------------------------------------------------- helpers

  private async findOwnOrder(userId: string, orderCode: string) {
    // Đơn của người khác cũng trả 404 (không lộ mã đơn nào tồn tại)
    const order = await this.dataSource
      .getRepository(Order)
      .findOneBy({ orderCode, userId });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
    return order;
  }

  private isAwaitingPayos(order: Order, payment: Payment | null): boolean {
    return (
      order.status === OrderStatus.PENDING &&
      payment?.provider === PAYOS_PROVIDER &&
      payment.status === PaymentStatus.PENDING
    );
  }

  private lockCart(manager: EntityManager, userId: string) {
    return manager.query(
      'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
      [CART_LOCK_NAMESPACE, userId],
    );
  }

  private async addHistory(
    manager: EntityManager,
    data: Partial<OrderStatusHistory>,
  ) {
    const repo = manager.getRepository(OrderStatusHistory);
    await repo.save(repo.create(data));
  }

  // Huỷ đơn chưa thanh toán + trả hàng về giỏ để khách đặt lại dễ dàng. Phải gọi trong transaction.
  private async cancelInTx(
    manager: EntityManager,
    orderId: string,
    note: string,
    changedBy: string | null,
  ): Promise<void> {
    const orderRepo = manager.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id: orderId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order || order.status === OrderStatus.CANCELLED) return;
    if (order.paymentStatus === PaymentStatus.SUCCESS) {
      throw new ConflictException(
        'Đơn đã được thanh toán, vui lòng liên hệ cửa hàng để huỷ.',
      );
    }

    await orderRepo.update(order.id, {
      status: OrderStatus.CANCELLED,
      paymentStatus: PaymentStatus.CANCELLED,
      cancelledAt: new Date(),
    });
    await manager
      .getRepository(Payment)
      .update(
        { orderId: order.id, status: PaymentStatus.PENDING },
        { status: PaymentStatus.CANCELLED },
      );
    await this.addHistory(manager, {
      orderId: order.id,
      fromStatus: order.status,
      toStatus: OrderStatus.CANCELLED,
      changedBy: changedBy ?? undefined,
      note,
    });

    // Trả hàng về giỏ ACTIVE (gộp số lượng nếu giỏ đã có biến thể đó, tối đa 99)
    await this.lockCart(manager, order.userId);
    const cartRepo = manager.getRepository(Cart);
    const cart =
      (await cartRepo.findOne({
        where: { userId: order.userId, status: CartStatus.ACTIVE },
        order: { createdAt: 'ASC' },
      })) ??
      (await cartRepo.save(
        cartRepo.create({ userId: order.userId, status: CartStatus.ACTIVE }),
      ));
    const cartItemRepo = manager.getRepository(CartItem);
    const orderItems = await manager
      .getRepository(OrderItem)
      .find({ where: { orderId: order.id } });
    for (const item of orderItems) {
      const existing = await cartItemRepo.findOneBy({
        cartId: cart.id,
        variantId: item.variantId,
      });
      if (existing) {
        await cartItemRepo.update(existing.id, {
          quantity: Math.min(
            MAX_CART_QUANTITY,
            existing.quantity + item.quantity,
          ),
        });
      } else {
        await cartItemRepo.save(
          cartItemRepo.create({
            cartId: cart.id,
            variantId: item.variantId,
            quantity: Math.min(MAX_CART_QUANTITY, item.quantity),
            unitPrice: item.unitPrice,
          }),
        );
      }
    }
  }

  private toSummary(
    order: Order,
    items: OrderItem[],
    payment?: Payment | null,
  ): MyOrderSummaryDto {
    return {
      orderCode: order.orderCode,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: toMethod(payment),
      totalAmount: order.totalAmount,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      createdAt: order.createdAt,
    };
  }
}

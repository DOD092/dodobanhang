import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';
import { Order } from '../../order/entities/order.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';

@Entity('order_vouchers')
@Unique(['orderId', 'voucherId'])
export class OrderVoucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid', name: 'voucher_id' })
  voucherId: string;

  @ManyToOne(() => Voucher, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @Column({ type: 'varchar', length: 50, name: 'voucher_code' })
  voucherCode: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'discount_amount', transformer: numericTransformer })
  discountAmount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';
import { OrderStatus } from '../../../common/enum/order-status.enum';
import { PaymentStatus } from '../../../common/enum/payment.enum';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../user/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'order_code', unique: true })
  orderCode: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'shipping_address_id' })
  shippingAddressId: string;

  @ManyToOne(() => Address, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: Address;

  @Column({ type: 'varchar', length: 30, name: 'status' })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 30, name: 'payment_status' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'subtotal', transformer: numericTransformer })
  subtotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'discount_amount', default: 0, transformer: numericTransformer })
  discountAmount: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'shipping_fee', default: 0, transformer: numericTransformer })
  shippingFee: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'tax_amount', default: 0, transformer: numericTransformer })
  taxAmount: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'total_amount', transformer: numericTransformer })
  totalAmount: number;

  @Column({ type: 'text', name: 'customer_note', nullable: true })
  customerNote?: string;

  @Column({ type: 'timestamptz', name: 'confirmed_at', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamptz', name: 'cancelled_at', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

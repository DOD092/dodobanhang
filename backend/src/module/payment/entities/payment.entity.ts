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
import { PaymentMethod } from '../../../common/enum/payment.enum';
import { PaymentStatus } from '../../../common/enum/payment.enum';
import { Order } from '../../order/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 30, name: 'payment_method' })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', length: 50, name: 'provider', nullable: true })
  provider?: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'amount',
    transformer: numericTransformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 30, name: 'status' })
  status: PaymentStatus;

  @Column({ type: 'timestamptz', name: 'paid_at', nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamptz', name: 'expired_at', nullable: true })
  expiredAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

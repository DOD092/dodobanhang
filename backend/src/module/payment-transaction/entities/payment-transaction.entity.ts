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
import { PaymentStatus } from '../../../common/enum/payment.enum';
import { TransactionType } from '../../../common/enum/payment.enum';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'payment_id' })
  paymentId: string;

  @ManyToOne(() => Payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'provider_transaction_id',
    nullable: true,
  })
  providerTransactionId?: string;

  @Column({ type: 'varchar', length: 30, name: 'transaction_type' })
  transactionType: TransactionType;

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

  @Column({
    type: 'varchar',
    length: 50,
    name: 'response_code',
    nullable: true,
  })
  responseCode?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';
import { DiscountType } from '../../../common/enum/discount-type.enum';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'code', unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150, name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, name: 'discount_type' })
  discountType: DiscountType;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'discount_value', transformer: numericTransformer })
  discountValue: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'minimum_order_amount', default: 0, transformer: numericTransformer })
  minimumOrderAmount: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, name: 'maximum_discount_amount', nullable: true, transformer: numericTransformer })
  maximumDiscountAmount?: number;

  @Column({ type: 'int', name: 'usage_count', default: 0 })
  usageCount: number;

  @Column({ type: 'timestamptz', name: 'start_at' })
  startAt: Date;

  @Column({ type: 'timestamptz', name: 'end_at' })
  endAt: Date;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

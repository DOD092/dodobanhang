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
import { ShipmentCarrier } from '../../../common/enum/shipment.enum';
import { ShipmentStatus } from '../../../common/enum/shipment.enum';
import { Order } from '../../order/entities/order.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 50, name: 'carrier' })
  carrier: ShipmentCarrier;

  @Column({ type: 'varchar', length: 100, name: 'tracking_number' })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 30, name: 'status' })
  status: ShipmentStatus;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'shipping_fee',
    default: 0,
    transformer: numericTransformer,
  })
  shippingFee: number;

  @Column({ type: 'timestamptz', name: 'shipped_at', nullable: true })
  shippedAt?: Date;

  @Column({ type: 'timestamptz', name: 'delivered_at', nullable: true })
  deliveredAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

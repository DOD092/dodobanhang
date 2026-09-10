import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';
import { Order } from '../../order/entities/order.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Entity('order_items')
@Check(`"quantity" > 0`)
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid', name: 'variant_id' })
  variantId: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column({ type: 'varchar', length: 200, name: 'product_name' })
  productName: string;

  @Column({ type: 'varchar', length: 200, name: 'variant_name' })
  variantName: string;

  @Column({ type: 'varchar', length: 100, name: 'sku' })
  sku: string;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'unit_price',
    transformer: numericTransformer,
  })
  unitPrice: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'discount_amount',
    default: 0,
    transformer: numericTransformer,
  })
  discountAmount: number;
}

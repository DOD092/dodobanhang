import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';
import { Cart } from '../../cart/entities/cart.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Entity('cart_items')
@Unique(['cartId', 'variantId'])
@Check(`"quantity" > 0`)
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ type: 'uuid', name: 'variant_id' })
  variantId: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

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

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

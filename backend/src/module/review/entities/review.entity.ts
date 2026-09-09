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
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('reviews')
@Unique(['orderItemId'])
@Check(`"rating" BETWEEN 1 AND 5`)
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'order_item_id' })
  orderItemId: string;

  @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @Column({ type: 'smallint', name: 'rating' })
  rating: number;

  @Column({ type: 'varchar', length: 200, name: 'title', nullable: true })
  title?: string;

  @Column({ type: 'text', name: 'comment', nullable: true })
  comment?: string;

  @Column({ type: 'boolean', name: 'is_verified_purchase', default: false })
  isVerifiedPurchase: boolean;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

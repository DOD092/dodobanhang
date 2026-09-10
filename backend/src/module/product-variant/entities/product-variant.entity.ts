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
import { Product } from '../../product/entities/product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 100, name: 'sku', unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 200, name: 'variant_name' })
  variantName: string;

  @Column({ type: 'varchar', length: 50, name: 'color', nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 50, name: 'size', nullable: true })
  size?: string;

  @Column({ type: 'varchar', length: 50, name: 'storage', nullable: true })
  storage?: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'price',
    transformer: numericTransformer,
  })
  price: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'compare_at_price',
    nullable: true,
    transformer: numericTransformer,
  })
  compareAtPrice?: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    name: 'cost_price',
    nullable: true,
    transformer: numericTransformer,
  })
  costPrice?: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'weight',
    nullable: true,
    transformer: numericTransformer,
  })
  weight?: number;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

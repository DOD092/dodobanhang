import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity('inventories')
@Unique(['warehouseId', 'variantId'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'uuid', name: 'variant_id' })
  variantId: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column({ type: 'int', name: 'quantity_on_hand', default: 0 })
  quantityOnHand: number;

  @Column({ type: 'int', name: 'quantity_reserved', default: 0 })
  quantityReserved: number;

  @Column({ type: 'int', name: 'quantity_available', default: 0 })
  quantityAvailable: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

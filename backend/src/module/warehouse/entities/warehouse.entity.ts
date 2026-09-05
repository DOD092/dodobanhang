import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'warehouse_code', unique: true })
  warehouseCode: string;

  @Column({ type: 'varchar', length: 150, name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'address' })
  address: string;

  @Column({ type: 'varchar', length: 100, name: 'province' })
  province: string;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

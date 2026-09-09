import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity('warehouse_operators')
export class WarehouseOperator {
  // PK/FK: khoá chính lấy từ bảng users (quan hệ 1-1), không tự sinh
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'varchar', length: 30, name: 'shift' })
  shift: string;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

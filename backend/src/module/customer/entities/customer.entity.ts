import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('customers')
export class Customer {
  // PK/FK: khoá chính lấy từ bảng users (quan hệ 1-1), không tự sinh
  @AutoMap()
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: 'user_id' }) // Customer giữ khóa ngoại user_id
  user: User;

  @AutoMap()
  @Column({ type: 'varchar', length: 50, unique: true, name: 'customer_code' })
  customerCode: string;

  @AutoMap()
  @Column({ type: 'int', default: 0, name: 'loyalty_points' })
  loyaltyPoints: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
  id: any;
}

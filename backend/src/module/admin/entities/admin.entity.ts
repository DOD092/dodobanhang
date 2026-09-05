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

@Entity('admins')
export class Admin {
  // PK/FK: Không dùng tự tăng (PrimaryGeneratedColumn) vì ID này lấy từ bảng users
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'varchar', length: 100, name: 'department' })
  department: string;

  // Sửa lỗi chính tả "postition" trong ERD thành "position" cho chuẩn tiếng Anh
  @Column({ type: 'varchar', length: 100, name: 'position' })
  position: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

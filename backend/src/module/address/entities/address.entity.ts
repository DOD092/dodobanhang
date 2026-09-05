import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 150, name: 'receiver_name' })
  receiverName: string;

  @Column({ type: 'varchar', length: 20, name: 'receiver_phone' })
  receiverPhone: string;

  @Column({ type: 'text', name: 'address_line' })
  addressLine: string;

  @Column({ type: 'varchar', length: 100, name: 'ward' })
  ward: string;

  @Column({ type: 'varchar', length: 100, name: 'district' })
  district: string;

  @Column({ type: 'varchar', length: 100, name: 'province' })
  province: string;

  @Column({ type: 'varchar', length: 100, name: 'country', default: 'VN' })
  country: string;

  @Column({ type: 'varchar', length: 20, name: 'postal_code', nullable: true })
  postalCode?: string;

  @Column({ type: 'boolean', name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

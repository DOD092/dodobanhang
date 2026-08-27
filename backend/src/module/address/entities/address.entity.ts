import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  recipientName: string;

  @Column()
  phone: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ nullable: true })
  district?: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ default: 'VN' })
  country: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

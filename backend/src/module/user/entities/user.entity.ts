import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { Role } from '../../role/entities/role.entity';

@Entity('users')
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, name: 'email', unique: true })
  email: string;

  // nullable: Google không trả về số điện thoại. Form đăng ký thường vẫn bắt
  // buộc nhập (ràng buộc nằm ở DTO), chỉ cột DB là nới ra.
  @AutoMap(() => String)
  @Column({type: 'varchar', nullable: true,})
  phone: string | null;

  // 3 field dưới đây CỐ Ý không có @AutoMap(): passwordHash/status/roleId do
  // server tự quyết. Không gắn decorator = AutoMapper không bao giờ đổ được
  // giá trị từ DTO của client vào, kể cả khi client cố gửi lên.
  //
  // nullable: tài khoản đăng nhập bằng Google không có mật khẩu.
  @Column({
    type: 'varchar',
    length: 255,
    name: 'password_hash',
    nullable: true,
  })
  passwordHash: string | null;

  @AutoMap()
  @Column({ type: 'varchar', length: 150, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 500, name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @AutoMap(() => Date)
  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @AutoMap()
  @Column({ type: 'varchar', length: 20, name: 'gender', nullable: true })
  gender?: string;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: UserStatus;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
  type: 'varchar',
  length: 6,
  nullable: true,
  name: 'verification_code',
  })
  verificationCode: string | null;

  @Column({
  type: 'timestamptz',
  nullable: true,
  name: 'verification_expire_at',
  })
  verificationExpireAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({
  type: 'varchar',
  length: 6,
  nullable: true,
  name: 'reset_password_code',
  })
  passwordResetCode: string | null;

  @Column({
    type:'timestamptz',
    nullable:true,
    name:'reset_password_expire_at',
  })
  passwordResetExpireAt!: Date | null;

  @Column({
  type: 'varchar',
  length: 255,
  nullable: true,
  unique: true,
  name: 'google_id',
  })
  googleId!: string | null;

}

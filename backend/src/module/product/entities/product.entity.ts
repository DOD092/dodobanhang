import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';
import { numericTransformer } from '../../../common/transformers/numeric.transformer';

// 1 dòng trong bảng "Thông tin chi tiết" của trang sản phẩm (vd Công ty phát hành, Số trang)
export interface ProductSpecification {
  name: string;
  value: string;
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'uuid', name: 'brand_id' })
  brandId: string;

  @ManyToOne(() => Brand, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ type: 'varchar', length: 200, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 200, name: 'slug', unique: true })
  slug: string;

  @Column({ type: 'text', name: 'short_description', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, name: 'status' })
  status: string;

  // ---- Thông tin hiển thị kiểu sàn TMĐT (23/11/2026). Tất cả nullable / có default để thêm cột
  // không làm hỏng dữ liệu cũ (backend.md 7.8).

  // Tác giả (sách) - hiện trên thẻ sản phẩm thay cho thương hiệu
  @Column({ type: 'varchar', length: 200, name: 'author', nullable: true })
  author?: string | null;

  // Điểm đánh giá trung bình 0-5 (1 chữ số thập phân). Chưa có bảng review gắn đơn hàng nên lưu sẵn.
  @Column({
    type: 'numeric',
    precision: 2,
    scale: 1,
    name: 'rating_average',
    nullable: true,
    transformer: numericTransformer,
  })
  ratingAverage?: number | null;

  @Column({ type: 'int', name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', name: 'sold_count', default: 0 })
  soldCount: number;

  @Column({ type: 'jsonb', name: 'specifications', nullable: true })
  specifications?: ProductSpecification[] | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import { toSlug } from '../../common/utils/vietnamese-search.util';
import { Brand } from '../../module/brand/entities/brand.entity';
import { Category } from '../../module/category/entities/category.entity';
import { ProductImage } from '../../module/product-image/entities/product-image.entity';
import { ProductVariant } from '../../module/product-variant/entities/product-variant.entity';
import { Product } from '../../module/product/entities/product.entity';
import { PUBLIC_STATUS } from '../../module/product/product.constants';
import {
  DEFAULT_BRAND,
  seedCategories,
  seedProducts,
} from './catalog.seed-data';

// Mốc created_at cố định (+1 giây mỗi phần tử) để thứ tự "Mới nhất" đúng như mảng
// seed và không đổi giữa các lần chạy. Sản phẩm thật thêm sau sẽ mới hơn -> hiện trước.
const SEED_BASE_TIME = Date.parse('2026-01-01T00:00:00Z');

/**
 * Nạp 5 nhóm + 13 sản phẩm thật (kèm biến thể, ảnh) cho web bán hàng.
 *
 * CHỈ chạy khi `SEED_CATALOG=true` trong .env — DB đang dùng chung cả nhóm, không
 * tự ghi dữ liệu mỗi lần ai đó boot app. Idempotent: bản ghi đã có (theo slug /
 * sku) thì bỏ qua, không ghi đè chỉnh sửa tay. Cả lượt chạy nằm trong 1 transaction.
 */
@Injectable()
export class CatalogSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(CatalogSeeder.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('SEED_CATALOG') !== 'true') return;

    const counts = await this.unitOfWork.execute((manager) =>
      this.seed(manager),
    );
    this.logger.log(
      `Seed catalog xong: +${counts.categories} category, +${counts.products} product ` +
        `(đã có thì bỏ qua). Nhớ tắt SEED_CATALOG sau khi chạy.`,
    );
  }

  private async seed(manager: EntityManager) {
    const brandRepo = this.unitOfWork.getRepository(manager, Brand);
    const categoryRepo = this.unitOfWork.getRepository(manager, Category);
    const productRepo = this.unitOfWork.getRepository(manager, Product);
    const variantRepo = this.unitOfWork.getRepository(manager, ProductVariant);
    const imageRepo = this.unitOfWork.getRepository(manager, ProductImage);
    const counts = { categories: 0, products: 0 };

    const brand =
      (await brandRepo.findOneBy({ slug: DEFAULT_BRAND.slug })) ??
      (await brandRepo.save(
        brandRepo.create({ ...DEFAULT_BRAND, status: PUBLIC_STATUS }),
      ));

    const categoryIds = new Map<string, string>();
    for (const [index, item] of seedCategories.entries()) {
      let category = await categoryRepo.findOneBy({ slug: item.slug });
      if (!category) {
        category = await categoryRepo.save(
          categoryRepo.create({
            ...item,
            status: PUBLIC_STATUS,
            createdAt: new Date(SEED_BASE_TIME + index * 1000),
          }),
        );
        counts.categories++;
      }
      categoryIds.set(item.slug, category.id);
    }

    for (const [index, item] of seedProducts.entries()) {
      const slug = toSlug(item.name);
      if (await productRepo.existsBy({ slug })) continue;
      if (await variantRepo.existsBy({ sku: item.sku })) {
        this.logger.warn(
          `Bỏ qua "${item.name}": SKU ${item.sku} đã thuộc sản phẩm khác`,
        );
        continue;
      }

      const categoryId = categoryIds.get(item.category);
      if (!categoryId)
        throw new Error(`Seed: category ${item.category} không tồn tại`);

      const product = await productRepo.save(
        productRepo.create({
          categoryId,
          brandId: brand.id,
          name: item.name,
          slug,
          description: item.description,
          status: PUBLIC_STATUS,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
        }),
      );
      await variantRepo.save(
        variantRepo.create({
          productId: product.id,
          sku: item.sku,
          variantName: item.name,
          price: item.price,
          status: PUBLIC_STATUS,
        }),
      );
      await imageRepo.save(
        item.images.map((imageUrl, order) =>
          imageRepo.create({
            productId: product.id,
            imageUrl,
            altText: item.name,
            sortOrder: order,
            isPrimary: order === 0,
          }),
        ),
      );
      counts.products++;
    }

    return counts;
  }
}

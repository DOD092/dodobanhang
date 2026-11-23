import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join, resolve } from 'path';
import { EntityManager } from 'typeorm';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import {
  normalizeVietnamese,
  toSlug,
} from '../../common/utils/vietnamese-search.util';
import { Brand } from '../../module/brand/entities/brand.entity';
import { Category } from '../../module/category/entities/category.entity';
import { ProductImage } from '../../module/product-image/entities/product-image.entity';
import { ProductVariant } from '../../module/product-variant/entities/product-variant.entity';
import { Product } from '../../module/product/entities/product.entity';
import { PUBLIC_STATUS } from '../../module/product/product.constants';
import { DEFAULT_BRAND } from '../catalog-seed/catalog.seed-data';

/**
 * Nạp sản phẩm GIẢ LẬP từ dữ liệu crawl Tiki (`python -m tiki_crawler ... --details`,
 * file `data/products.jsonl` ở gốc repo) để web có nhiều sản phẩm khi test.
 *
 * - CHỈ chạy khi `SEED_TIKI=true` (DB dùng chung cả nhóm). Mô tả/ảnh thuộc bản quyền người
 *   bán trên Tiki: chỉ dùng ở DB test / local, KHÔNG nạp lên DB production.
 * - Cần 5 nhóm của SEED_CATALOG có sẵn: sản phẩm được xếp vào nhóm theo từ khoá trong
 *   danh mục Tiki + tên (CATEGORY_RULES); không khớp nhóm nào thì bỏ qua. `TIKI_CATEGORY_SLUG`
 *   ép tất cả vào 1 nhóm.
 * - Idempotent: slug `<tên>-tiki-<id>` hoặc SKU đã có thì bỏ qua. Cả lượt chạy 1 transaction.
 * - Env: `TIKI_DATA_FILE` (mặc định ../data/products.jsonl tính từ backend/), `TIKI_SEED_LIMIT`.
 */

// Một dòng trong products.jsonl (tiki_crawler/models.py: Product)
interface TikiProduct {
  id: number;
  name: string;
  sku?: string | null;
  price?: number | null;
  original_price?: number | null;
  brand_name?: string | null;
  category_name?: string | null;
  category_path?: { id: number; name: string }[];
  short_description?: string | null;
  description?: string | null;
  images?: string[];
  variants?: {
    sku?: string | null;
    option?: string | null;
    price?: number | null;
    original_price?: number | null;
    image?: string | null;
  }[];
}

// Thứ tự quan trọng: "đèn năng lượng mặt trời" phải vào nhóm NLMT trước khi bị bắt bởi "den".
// Từ khoá so trên chuỗi đã bỏ dấu + chữ thường. `categoryOnly`: chỉ so với tên danh mục Tiki,
// không so với tên sản phẩm (bỏ dấu thì "đèn" = "đen": "ốp lưng màu đen" không phải đèn).
const CATEGORY_RULES: {
  slug: string;
  keywords: string[];
  categoryOnly?: string[];
}[] = [
  {
    slug: 'nang-luong-mat-troi',
    keywords: ['nang luong mat troi', 'pin mat troi', 'solar'],
  },
  {
    slug: 'den-led-chieu-sang',
    keywords: ['chieu sang', 'den led', 'bong den'],
    categoryOnly: ['den '],
  },
  {
    slug: 'thiet-bi-nong-nghiep',
    keywords: [
      'nong nghiep',
      'lam vuon',
      'binh phun',
      'may cat co',
      'tuoi cay',
      'flycam',
    ],
  },
  { slug: 'vat-lieu-nhom', keywords: ['nhom'] },
  {
    slug: 'co-khi-phu-kien',
    keywords: [
      'co khi',
      'vong bi',
      'bac dan',
      'oc vit',
      'bu loong',
      'dung cu',
      'kim khi',
      'pa lang',
    ],
  },
];

const LIMITS = {
  name: 200,
  slug: 200,
  sku: 100,
  variantName: 200,
  brand: 100,
  url: 500,
};
const cut = (value: string, max: number) => value.trim().slice(0, max).trim();

@Injectable()
export class TikiSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(TikiSeeder.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('SEED_TIKI') !== 'true') return;

    const file = resolve(
      this.configService.get<string>('TIKI_DATA_FILE') ??
        join(process.cwd(), '..', 'data', 'products.jsonl'),
    );
    if (!fs.existsSync(file)) {
      this.logger.error(
        `Không thấy ${file}. Chạy tiki_crawler (--details) trước hoặc đặt TIKI_DATA_FILE.`,
      );
      return;
    }

    const limit = Number(
      this.configService.get<string>('TIKI_SEED_LIMIT') ?? 0,
    );
    const items = this.readJsonl(file).slice(0, limit > 0 ? limit : undefined);
    const counts = await this.unitOfWork.execute((manager) =>
      this.seed(manager, items),
    );
    this.logger.log(
      `Seed Tiki xong (${items.length} dòng): +${counts.products} product, +${counts.variants} variant, ` +
        `+${counts.brands} brand; bỏ qua ${counts.existed} đã có, ${counts.unmatched} không khớp nhóm, ` +
        `${counts.invalid} thiếu dữ liệu. Nhớ tắt SEED_TIKI sau khi chạy.`,
    );
  }

  private readJsonl(file: string): TikiProduct[] {
    const items: TikiProduct[] = [];
    for (const line of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        items.push(JSON.parse(line) as TikiProduct);
      } catch {
        this.logger.warn('Bỏ qua 1 dòng JSON lỗi trong products.jsonl');
      }
    }
    return items;
  }

  private matchCategory(item: TikiProduct): string | null {
    const forced = this.configService.get<string>('TIKI_CATEGORY_SLUG');
    if (forced) return forced;
    const categories = normalizeVietnamese(
      [
        ...(item.category_path ?? []).map((c) => c.name),
        item.category_name,
      ].join(' | ') + ' ',
    );
    const all = `${categories} | ${normalizeVietnamese(item.name)}`;
    return (
      CATEGORY_RULES.find(
        (rule) =>
          rule.keywords.some((k) => all.includes(k)) ||
          (rule.categoryOnly ?? []).some((k) => categories.includes(k)),
      )?.slug ?? null
    );
  }

  private async seed(manager: EntityManager, items: TikiProduct[]) {
    const brandRepo = this.unitOfWork.getRepository(manager, Brand);
    const categoryRepo = this.unitOfWork.getRepository(manager, Category);
    const productRepo = this.unitOfWork.getRepository(manager, Product);
    const variantRepo = this.unitOfWork.getRepository(manager, ProductVariant);
    const imageRepo = this.unitOfWork.getRepository(manager, ProductImage);
    const counts = {
      products: 0,
      variants: 0,
      brands: 0,
      existed: 0,
      unmatched: 0,
      invalid: 0,
    };

    const categoryIds = new Map<string, string>();
    for (const rule of CATEGORY_RULES) {
      const category = await categoryRepo.findOneBy({ slug: rule.slug });
      if (category) categoryIds.set(rule.slug, category.id);
    }
    const forced = this.configService.get<string>('TIKI_CATEGORY_SLUG');
    if (forced && !categoryIds.has(forced)) {
      const category = await categoryRepo.findOneBy({ slug: forced });
      if (category) categoryIds.set(forced, category.id);
    }
    if (categoryIds.size === 0) {
      throw new Error(
        'Seed Tiki: chưa có nhóm sản phẩm nào, chạy SEED_CATALOG=true trước.',
      );
    }

    const brandIds = new Map<string, string>();
    const brandId = async (name?: string | null): Promise<string> => {
      const brandName = cut(name || DEFAULT_BRAND.name, LIMITS.brand);
      const slug = toSlug(brandName, LIMITS.brand) || DEFAULT_BRAND.slug;
      const cached = brandIds.get(slug);
      if (cached) return cached;
      let brand = await brandRepo.findOneBy({ slug });
      if (!brand) {
        brand = await brandRepo.save(
          brandRepo.create({ name: brandName, slug, status: PUBLIC_STATUS }),
        );
        counts.brands++;
      }
      brandIds.set(slug, brand.id);
      return brand.id;
    };

    for (const item of items) {
      if (!item?.id || !item.name?.trim()) {
        counts.invalid++;
        continue;
      }
      const categorySlug = this.matchCategory(item);
      const categoryId = categorySlug
        ? categoryIds.get(categorySlug)
        : undefined;
      if (!categoryId) {
        counts.unmatched++;
        continue;
      }

      const name = cut(item.name, LIMITS.name);
      const suffix = `-tiki-${item.id}`;
      const slug = `${toSlug(name, LIMITS.slug - suffix.length)}${suffix}`;
      if (await productRepo.existsBy({ slug })) {
        counts.existed++;
        continue;
      }

      // Sản phẩm có biến thể (configurable_products) -> mỗi biến thể 1 dòng; không thì 1 biến thể
      const variants = (
        item.variants?.length
          ? item.variants
          : [
              {
                sku: item.sku,
                option: null,
                price: item.price,
                original_price: item.original_price,
                image: null,
              },
            ]
      )
        .map((v) => ({
          ...v,
          sku: v.sku ? cut(String(v.sku), LIMITS.sku) : null,
        }))
        .filter((v): v is typeof v & { sku: string } => Boolean(v.sku));
      const fresh: typeof variants = [];
      for (const v of variants) {
        if (!(await variantRepo.existsBy({ sku: v.sku }))) fresh.push(v);
      }
      if (fresh.length === 0) {
        counts[variants.length ? 'existed' : 'invalid']++;
        continue;
      }

      const product = await productRepo.save(
        productRepo.create({
          categoryId,
          brandId: await brandId(item.brand_name),
          name,
          slug,
          shortDescription: item.short_description ?? undefined,
          description: item.description ?? undefined,
          status: PUBLIC_STATUS,
        }),
      );

      const savedVariants = await variantRepo.save(
        fresh.map((v) => {
          const price =
            typeof v.price === 'number' && v.price > 0 ? v.price : null;
          const compare =
            typeof v.original_price === 'number' &&
            price !== null &&
            v.original_price > price
              ? v.original_price
              : undefined;
          return variantRepo.create({
            productId: product.id,
            sku: v.sku,
            variantName: cut(
              v.option ? `${name} - ${v.option}` : name,
              LIMITS.variantName,
            ),
            price,
            compareAtPrice: compare,
            status: PUBLIC_STATUS,
          });
        }),
      );
      counts.variants += savedVariants.length;

      // Ảnh chung của sản phẩm (ảnh đầu = ảnh chính) + ảnh riêng của biến thể nếu khác
      const productImages = (item.images ?? []).filter(
        (url) => url && url.length <= LIMITS.url,
      );
      const seen = new Set(productImages);
      const variantImages = savedVariants.flatMap((saved, i) => {
        const url = fresh[i].image;
        if (!url || url.length > LIMITS.url || seen.has(url)) return [];
        seen.add(url);
        return [{ url, variantId: saved.id }];
      });
      await imageRepo.save([
        ...productImages.map((imageUrl, order) =>
          imageRepo.create({
            productId: product.id,
            imageUrl,
            altText: cut(name, 255),
            sortOrder: order,
            isPrimary: order === 0,
          }),
        ),
        ...variantImages.map((img, i) =>
          imageRepo.create({
            productId: product.id,
            variantId: img.variantId,
            imageUrl: img.url,
            altText: cut(name, 255),
            sortOrder: productImages.length + i,
            isPrimary: productImages.length === 0 && i === 0,
          }),
        ),
      ]);
      counts.products++;
    }
    return counts;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import {
  escapeLike,
  toKeywords,
  UNACCENT_PARAMS,
  unaccentSql,
} from '../../common/utils/vietnamese-search.util';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { Product } from './entities/product.entity';
import {
  CatalogProductRows,
  IProductRepository,
} from './interface/product-repository.interface';
import { PUBLIC_STATUS } from './product.constants';

// Giá đại diện của sản phẩm = giá thấp nhất trong các biến thể (MIN bỏ qua NULL;
// mọi biến thể đều null -> null = "Liên hệ").
const MIN_PRICE_SQL =
  '(SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = product.id)';

// Chuỗi để tìm từ khoá: tên + mô tả ngắn + mô tả + mọi SKU của sản phẩm
const SEARCH_HAYSTACK_SQL = `concat_ws(' ', product.name, product.short_description, product.description,
  (SELECT string_agg(v.sku, ' ') FROM product_variants v WHERE v.product_id = product.id))`;

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository, 'Product');
  }

  async search(
    query: SearchProductQueryDto,
  ): Promise<{ rows: CatalogProductRows; total: number; page: number }> {
    const qb = this.publicQuery();

    if (query.category) {
      qb.andWhere('category.slug = :categorySlug', {
        categorySlug: query.category,
      });
    }
    if (query.minPrice !== undefined) {
      qb.andWhere(`${MIN_PRICE_SQL} >= :minPrice`, {
        minPrice: query.minPrice,
      });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere(`${MIN_PRICE_SQL} < :maxPrice`, {
        maxPrice: query.maxPrice,
      });
    }

    const keywords = toKeywords(query.q);
    if (keywords.length > 0) {
      qb.setParameters(UNACCENT_PARAMS);
      keywords.forEach((word, index) => {
        qb.andWhere(`${unaccentSql(SEARCH_HAYSTACK_SQL)} LIKE :kw${index}`, {
          [`kw${index}`]: `%${escapeLike(word)}%`,
        });
      });
    }

    switch (query.sort) {
      case 'price-asc':
        // Sản phẩm "Liên hệ" (giá null) luôn xếp cuối dù tăng hay giảm dần
        qb.orderBy(MIN_PRICE_SQL, 'ASC', 'NULLS LAST');
        break;
      case 'price-desc':
        qb.orderBy(MIN_PRICE_SQL, 'DESC', 'NULLS LAST');
        break;
      case 'name-asc':
        // Sắp theo tên bỏ dấu: collation của Postgres xếp 'Đ' (U+0110) sau 'Z',
        // nên "Đèn..." sẽ bị đẩy xuống cuối nếu sắp theo product.name thô.
        qb.setParameters(UNACCENT_PARAMS);
        qb.orderBy(unaccentSql('product.name'), 'ASC');
        qb.addOrderBy('product.name', 'ASC');
        break;
      default:
        qb.orderBy('product.createdAt', 'DESC');
    }
    qb.addOrderBy('product.id', 'ASC'); // thứ tự ổn định khi trùng giá trị sắp xếp

    // Trang vượt quá thì trả về trang cuối (frontend không phải tự xử lý)
    const total = await qb.getCount();
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const page = Math.min(query.page, totalPages);

    // offset/limit (không phải skip/take): chỉ join many-to-one nên không nhân dòng
    const products = await qb
      .offset((page - 1) * query.limit)
      .limit(query.limit)
      .getMany();

    return { rows: await this.withChildren(products), total, page };
  }

  async findPublicBySlug(
    slug: string,
  ): Promise<CatalogProductRows[number] | null> {
    const product = await this.publicQuery()
      .andWhere('product.slug = :slug', { slug })
      .getOne();
    if (!product) return null;

    const [row] = await this.withChildren([product]);
    return row;
  }

  private publicQuery(): SelectQueryBuilder<Product> {
    return this.repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.category', 'category')
      .where('product.status = :status', { status: PUBLIC_STATUS })
      .andWhere('category.status = :status');
  }

  // Nạp biến thể + ảnh cho cả trang bằng 2 query (không N+1)
  private async withChildren(products: Product[]): Promise<CatalogProductRows> {
    if (products.length === 0) return [];
    const ids = products.map((item) => item.id);
    const manager = this.repository.manager;

    const [variants, images] = await Promise.all([
      manager.getRepository(ProductVariant).find({
        where: { productId: In(ids) },
        order: { createdAt: 'ASC', id: 'ASC' },
      }),
      manager.getRepository(ProductImage).find({
        where: { productId: In(ids) },
        order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
      }),
    ]);

    return products.map((product) => ({
      product,
      variants: variants.filter((item) => item.productId === product.id),
      images: images.filter((item) => item.productId === product.id),
    }));
  }
}

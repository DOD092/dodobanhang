import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CartStatus } from '../../common/enum/cart-status.enum';
import { UnitOfWork } from '../../common/unit-of-work/unit-of-work';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';
import { PUBLIC_STATUS } from '../product/product.constants';
import { AddToCartDto, MAX_CART_QUANTITY } from './dto/add-to-cart.dto';
import { Cart } from './entities/cart.entity';
import {
  IMyCartService,
  MyCartDto,
} from './interface/my-cart-service.interface';

// Khoá cấp 1 của pg_advisory_xact_lock(int, int): tách khỏi các khoá advisory khác (nếu sau này có)
const CART_LOCK_NAMESPACE = 'cart:add-item';

@Injectable()
export class MyCartService implements IMyCartService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    // Đọc giỏ (không cần transaction); TypeOrmModule cung cấp DataSource toàn app
    private readonly dataSource: DataSource,
  ) {}

  async addItem(userId: string, dto: AddToCartDto): Promise<MyCartDto> {
    await this.unitOfWork.execute(async (manager) => {
      // Xếp hàng các lần thêm của CÙNG 1 user (bấm 2 lần / 2 tab cùng lúc). Không khoá thì 2 request
      // cùng thấy "chưa có giỏ / chưa có dòng" -> tạo 2 giỏ ACTIVE, hoặc INSERT trùng UNIQUE(cart, variant)
      // -> lỗi. Khoá tự nhả khi transaction kết thúc; user khác không bị chờ. Không cần đổi schema.
      await manager.query(
        'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
        [CART_LOCK_NAMESPACE, userId],
      );

      const variant = await manager.getRepository(ProductVariant).findOne({
        where: { id: dto.variantId },
        relations: { product: true },
      });
      // Chỉ bán biến thể của sản phẩm đang hiện trên web và đã có giá
      if (!variant || variant.product.status !== PUBLIC_STATUS) {
        throw new NotFoundException(
          'Sản phẩm không tồn tại hoặc đã ngừng bán.',
        );
      }
      if (variant.price === null) {
        throw new BadRequestException(
          'Sản phẩm chưa có giá, vui lòng liên hệ để đặt mua.',
        );
      }

      const cart = await this.findOrCreateActiveCart(manager, userId);
      const itemRepo = manager.getRepository(CartItem);
      const existing = await itemRepo.findOneBy({
        cartId: cart.id,
        variantId: variant.id,
      });

      if (existing) {
        const quantity = existing.quantity + dto.quantity;
        if (quantity > MAX_CART_QUANTITY) {
          throw new BadRequestException(
            `Mỗi sản phẩm tối đa ${MAX_CART_QUANTITY} cái trong giỏ.`,
          );
        }
        await itemRepo.update(existing.id, {
          quantity,
          unitPrice: variant.price,
        });
      } else {
        await itemRepo.save(
          itemRepo.create({
            cartId: cart.id,
            variantId: variant.id,
            quantity: dto.quantity,
            unitPrice: variant.price, // giá lấy từ DB, không lấy từ client
          }),
        );
      }
    });
    return this.getMyCart(userId);
  }

  // Đặt lại số lượng 1 dòng. Dòng phải thuộc giỏ ACTIVE của CHÍNH user (không thì 404,
  // không để lộ dòng của người khác có tồn tại hay không).
  async updateItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<MyCartDto> {
    const item = await this.findOwnItem(userId, itemId);
    await this.dataSource.getRepository(CartItem).update(item.id, { quantity });
    return this.getMyCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<MyCartDto> {
    const item = await this.findOwnItem(userId, itemId);
    await this.dataSource.getRepository(CartItem).delete(item.id);
    return this.getMyCart(userId);
  }

  private async findOwnItem(userId: string, itemId: string): Promise<CartItem> {
    const item = await this.dataSource
      .getRepository(CartItem)
      .createQueryBuilder('item')
      .innerJoin('item.cart', 'cart')
      .where('item.id = :itemId', { itemId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.status = :status', { status: CartStatus.ACTIVE })
      .getOne();
    if (!item) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng của bạn.');
    }
    return item;
  }

  async getMyCart(userId: string): Promise<MyCartDto> {
    const manager = this.dataSource.manager;
    const cart = await manager.getRepository(Cart).findOne({
      where: { userId, status: CartStatus.ACTIVE },
      order: { createdAt: 'ASC' },
    });
    if (!cart)
      return { cartId: null, items: [], totalQuantity: 0, totalAmount: 0 };

    const rows = await manager.getRepository(CartItem).find({
      where: { cartId: cart.id },
      relations: { variant: { product: true } },
      order: { createdAt: 'ASC' },
    });
    const items = rows.map((row) => ({
      id: row.id,
      variantId: row.variantId,
      productName: row.variant.product.name,
      productSlug: row.variant.product.slug,
      variantName: row.variant.variantName,
      image: null, // bước mở rộng: lấy ảnh chính từ product_images
      unitPrice: row.unitPrice,
      quantity: row.quantity,
    }));
    return {
      cartId: cart.id,
      items,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    };
  }

  // Mỗi user 1 giỏ ACTIVE. DB chưa có UNIQUE(user_id, status) nên lấy giỏ cũ nhất nếu lỡ có nhiều.
  private async findOrCreateActiveCart(
    manager: EntityManager,
    userId: string,
  ): Promise<Cart> {
    const repo = manager.getRepository(Cart);
    const cart = await repo.findOne({
      where: { userId, status: CartStatus.ACTIVE },
      order: { createdAt: 'ASC' },
    });
    return (
      cart ?? repo.save(repo.create({ userId, status: CartStatus.ACTIVE }))
    );
  }
}

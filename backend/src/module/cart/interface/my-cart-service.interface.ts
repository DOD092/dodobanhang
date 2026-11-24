import { AddToCartDto } from '../dto/add-to-cart.dto';

// Giỏ hàng trả cho frontend (/api/cart/me): đã tính sẵn tổng, giá lấy từ DB
export interface MyCartDto {
  cartId: string | null;
  items: {
    id: string;
    variantId: string;
    productName: string;
    productSlug: string;
    variantName: string;
    image: string | null;
    unitPrice: number;
    quantity: number;
  }[];
  totalQuantity: number;
  totalAmount: number;
}

// Giỏ của CHÍNH người đang đăng nhập (userId lấy từ JWT)
export interface IMyCartService {
  getMyCart(userId: string): Promise<MyCartDto>;
  addItem(userId: string, dto: AddToCartDto): Promise<MyCartDto>;
  updateItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<MyCartDto>;
  removeItem(userId: string, itemId: string): Promise<MyCartDto>;
}

// Token DI cho lớp Service của mọi module — dùng để bind interface (IxxxService)
// với class cụ thể trong providers của từng *.module.ts, và để Controller
// inject qua @Inject(...) thay vì phụ thuộc trực tiếp vào class.
export const ADDRESS_SERVICE = Symbol('ADDRESS_SERVICE');
export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
export const ADMIN_SERVICE = Symbol('ADMIN_SERVICE');
export const BRAND_SERVICE = Symbol('BRAND_SERVICE');
export const CART_SERVICE = Symbol('CART_SERVICE');
// Giỏ của người đang đăng nhập (/api/cart/me), khác CART_SERVICE (CRUD thô)
export const MY_CART_SERVICE = Symbol('MY_CART_SERVICE');
// Địa chỉ giao hàng của người đang đăng nhập (/api/addresses/me)
export const MY_ADDRESS_SERVICE = Symbol('MY_ADDRESS_SERVICE');
// Đặt hàng + xem đơn của người đang đăng nhập (/api/orders/me)
export const MY_ORDER_SERVICE = Symbol('MY_ORDER_SERVICE');
// Cổng thanh toán payOS (bọc SDK @payos/node), không có bảng riêng
export const PAYOS_SERVICE = Symbol('PAYOS_SERVICE');
export const CART_ITEM_SERVICE = Symbol('CART_ITEM_SERVICE');
export const CATEGORY_SERVICE = Symbol('CATEGORY_SERVICE');
export const CUSTOMER_SERVICE = Symbol('CUSTOMER_SERVICE');
export const INVENTORY_SERVICE = Symbol('INVENTORY_SERVICE');
export const ORDER_SERVICE = Symbol('ORDER_SERVICE');
export const ORDER_ITEM_SERVICE = Symbol('ORDER_ITEM_SERVICE');
export const ORDER_STATUS_HISTORY_SERVICE = Symbol(
  'ORDER_STATUS_HISTORY_SERVICE',
);
export const ORDER_VOUCHER_SERVICE = Symbol('ORDER_VOUCHER_SERVICE');
export const MAIL_SERVICE = Symbol('MAIL_SERVICE');
export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');
export const PAYMENT_TRANSACTION_SERVICE = Symbol(
  'PAYMENT_TRANSACTION_SERVICE',
);
export const PRODUCT_SERVICE = Symbol('PRODUCT_SERVICE');
export const PRODUCT_IMAGE_SERVICE = Symbol('PRODUCT_IMAGE_SERVICE');
export const PRODUCT_VARIANT_SERVICE = Symbol('PRODUCT_VARIANT_SERVICE');
export const REVIEW_SERVICE = Symbol('REVIEW_SERVICE');
// Ngoài 25 bảng ERD: form liên hệ trên web, không có bảng (chỉ gửi email)
export const CONTACT_SERVICE = Symbol('CONTACT_SERVICE');
export const ROLE_SERVICE = Symbol('ROLE_SERVICE');
export const SHIPMENT_SERVICE = Symbol('SHIPMENT_SERVICE');
export const SHIPMENT_ITEM_SERVICE = Symbol('SHIPMENT_ITEM_SERVICE');
export const USER_SERVICE = Symbol('USER_SERVICE');
export const VOUCHER_SERVICE = Symbol('VOUCHER_SERVICE');
export const WAREHOUSE_SERVICE = Symbol('WAREHOUSE_SERVICE');
export const WAREHOUSE_OPERATOR_SERVICE = Symbol('WAREHOUSE_OPERATOR_SERVICE');

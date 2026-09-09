/**
 * 3 role trong ERD. Lưu ở bảng `roles` (cột name) chứ không phải enum của Postgres,
 * để sau này thêm role mới không phải chạy migration đổi kiểu.
 */
export enum RoleName {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  WAREHOUSE_OPERATOR = 'WAREHOUSE_OPERATOR',
}

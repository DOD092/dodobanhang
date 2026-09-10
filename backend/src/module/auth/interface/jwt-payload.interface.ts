import { RoleName } from '../../../common/enum/role-name.enum';

// `sub` = user.id. Vì Admin/Customer/WarehouseOperator đều dùng userId làm
// khoá chính (quan hệ 1-1 với User), req.user.id đã đủ để tra hồ sơ theo role
// mà không cần thêm field id riêng như adminId/customerId.
export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleName;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: RoleName;
}

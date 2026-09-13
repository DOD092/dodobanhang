import { AutoMap } from '@automapper/classes';
import { Customer } from '../customer/entities/customer.entity';
import { User } from '../user/entities/user.entity';

/**
 * Gói tạm 2 entity vừa ghi xuống DB để AutoMapper gộp chúng thành 1 ResponseDto
 * trong MỘT lời gọi map() (xem forSelf trong auth.profile.ts), thay cho cách cũ
 * là `new Dto()` rồi mutate() hai lần.
 *
 * Không phải entity, không có bảng, không bao giờ ra tới client — chỉ tồn tại
 * để làm nguồn cho map gộp.
 */
export class CustomerRegistration {
  @AutoMap(() => User)
  user: User;

  @AutoMap(() => Customer)
  customer: Customer;
}

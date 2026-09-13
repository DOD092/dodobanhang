import {
  createMap,
  forMember,
  forSelf,
  fromValue,
  ignore,
  Mapper,
  MappingProfile,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Customer } from '../customer/entities/customer.entity';
import { UserStatus } from '../../common/enum/user-status.enum';
import { User } from '../user/entities/user.entity';
import { CustomerRegistration } from './customer-registration.aggregate';
import { CustomerRegisterRequestDto } from './dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from './dto/customer-register-response.dto';

/**
 * Luật ánh xạ cho luồng đăng ký khách hàng.
 *
 * Field trùng tên ở hai đầu thì AutoMapper tự map, không cần khai báo. Chỉ
 * những trường hợp dưới đây mới phải viết tay:
 *   - lệch tên          -> forMember(..., mapFrom(...))
 *   - hằng số           -> forMember(..., fromValue(...))
 *   - do service sinh   -> forMember(..., mapWithArguments(...))
 *   - không thuộc map   -> forMember(..., ignore())
 *
 * `ignore()` bắt buộc phải có ở các map gộp: nếu thiếu, AutoMapper log cảnh báo
 * "Unmapped properties" mỗi lần gọi. Nó chỉ bỏ qua property chứ không ghi đè
 * undefined, nên hai nguồn gộp vào không xoá dữ liệu của nhau.
 */
@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      // ===== TÁCH: 1 RequestDto -> 2 Entity =====

      // Tự map: email, dateOfBirth, gender (trùng tên).
      //
      // passwordHash/status/roleId vẫn KHÔNG có @AutoMap() trên User, nên
      // không có đường auto-map theo tên từ DTO của client vào. Đường duy nhất
      // đổ được vào chúng là 3 forMember + mapWithArguments dưới đây, và
      // mapWithArguments chỉ đọc extraArgs do AuthService truyền — không đọc
      // source. Client gửi lên field trùng tên cũng vô hiệu.
      createMap(
        mapper,
        CustomerRegisterRequestDto,
        User,
        forMember(
          (d) => d.fullName,
          mapFrom((s) => s.name),
        ),
        // cột phone NOT NULL nhưng client được phép bỏ trống
        forMember(
          (d) => d.phone,
          mapFrom((s) => s.phone ?? ''),
        ),
        forMember(
          (d) => d.passwordHash,
          mapWithArguments(
            (_source, { passwordHash }) => passwordHash as string,
          ),
        ),
        forMember(
          (d) => d.roleId,
          mapWithArguments((_source, { roleId }) => roleId as string),
        ),
        forMember(
          (d) => d.status,
          mapWithArguments((_source, { status }) => status as UserStatus),
        ),
        forMember((d) => d.id, ignore()),
      );

      // Customer không nhận field nào từ client: cả 3 đều do server quyết.
      createMap(
        mapper,
        CustomerRegisterRequestDto,
        Customer,
        forMember(
          (d) => d.userId,
          mapWithArguments((_source, { userId }) => userId as string),
        ),
        forMember(
          (d) => d.customerCode,
          mapWithArguments(
            (_source, { customerCode }) => customerCode as string,
          ),
        ),
        forMember((d) => d.loyaltyPoints, fromValue(0)),
      );

      // ===== GỘP: 2 Entity -> 1 ResponseDto =====

      // Tự map: email, fullName, dateOfBirth, gender (trùng tên).
      createMap(
        mapper,
        User,
        CustomerRegisterResponseDto,
        forMember(
          (d) => d.userId,
          mapFrom((s) => s.id),
        ),
        forMember((d) => d.customerId, ignore()),
        forMember((d) => d.customerCode, ignore()),
      );

      // Tự map: customerCode (trùng tên).
      createMap(
        mapper,
        Customer,
        CustomerRegisterResponseDto,
        forMember(
          (d) => d.customerId,
          mapFrom((s) => s.userId),
        ),
        forMember((d) => d.userId, ignore()),
        forMember((d) => d.email, ignore()),
        forMember((d) => d.fullName, ignore()),
        forMember((d) => d.dateOfBirth, ignore()),
        forMember((d) => d.gender, ignore()),
      );

      // forSelf kéo 2 map ở trên vào cùng một đích, nên nơi gọi chỉ cần MỘT
      // map() thay vì new Dto() + mutate() hai lần.
      //
      // CẨN THẬN: forSelf chỉ kế thừa các field auto-map theo tên
      // (email/fullName/dateOfBirth/gender từ User, customerCode từ Customer).
      // Field nào được định nghĩa bằng forMember trong map con thì nó KHÔNG
      // mang theo — phải khai lại ở đây, nếu không sẽ im lặng thiếu field.
      createMap(
        mapper,
        CustomerRegistration,
        CustomerRegisterResponseDto,
        forSelf(User, (s) => s.user),
        forSelf(Customer, (s) => s.customer),
        forMember(
          (d) => d.userId,
          mapFrom((s) => s.user.id),
        ),
        forMember(
          (d) => d.customerId,
          mapFrom((s) => s.customer.userId),
        ),
      );
    };
  }
}

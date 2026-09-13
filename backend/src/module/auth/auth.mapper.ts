import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '../../common/enum/user-status.enum';
import { Customer } from '../customer/entities/customer.entity';
import { User } from '../user/entities/user.entity';
import { CustomerRegistration } from './customer-registration.aggregate';
import { CustomerRegisterRequestDto } from './dto/customer-register-request.dto';
import { CustomerRegisterResponseDto } from './dto/customer-register-response.dto';

/**
 * Các field của User mà server tự quyết, client không được gửi lên.
 * Khai báo kiểu ở đây là điểm mấu chốt: `extraArgs` của AutoMapper có kiểu
 * `Record<string, unknown>` nên tự nó không bắt được lỗi thiếu key hay gõ sai
 * tên. Bọc qua interface này thì TypeScript kiểm tra lại được.
 */
export interface UserServerFields extends Record<string, unknown> {
  passwordHash: string;
  roleId: string;
  status: UserStatus;
}

/** Tương tự cho Customer — cả 3 field đều không đến từ client. */
export interface CustomerServerFields extends Record<string, unknown> {
  userId: string;
  customerCode: string;
}

/**
 * Lớp bọc mỏng quanh Mapper cho module auth.
 *
 * Mục đích là để nơi gọi (AuthService) chỉ còn một lời gọi mỗi bước, không phải
 * lặp lại cặp định danh (CustomerRegisterRequestDto, User) và không phải tự gõ
 * `{ extraArgs: () => ({...}) }`. Đổi lại, AuthService không cần @InjectMapper
 * nữa và mọi luật map của luồng đăng ký đều đi qua đúng một chỗ.
 */
@Injectable()
export class AuthMapper {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  /** RequestDto -> User. Tự map email/dateOfBirth/gender, name -> fullName. */
  toUser(
    dto: CustomerRegisterRequestDto,
    serverFields: UserServerFields,
  ): User {
    return this.mapper.map(dto, CustomerRegisterRequestDto, User, {
      extraArgs: () => serverFields,
    });
  }

  /** RequestDto -> Customer. Không field nào đến từ client. */
  toCustomer(
    dto: CustomerRegisterRequestDto,
    serverFields: CustomerServerFields,
  ): Customer {
    return this.mapper.map(dto, CustomerRegisterRequestDto, Customer, {
      extraArgs: () => serverFields,
    });
  }

  /** User + Customer -> 1 ResponseDto, gộp trong một lời gọi nhờ forSelf. */
  toRegisterResponse(
    user: User,
    customer: Customer,
  ): CustomerRegisterResponseDto {
    const registration = new CustomerRegistration();
    registration.user = user;
    registration.customer = customer;

    return this.mapper.map(
      registration,
      CustomerRegistration,
      CustomerRegisterResponseDto,
    );
  }
}

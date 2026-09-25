import { UseFilters } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiPropertyOptional, ApiProxyAuthenticationRequiredResponse } from "@nestjs/swagger";
import {IsEnum, IsOptional} from 'class-validator';

export enum UserRoleFilter{
    ADMIN='ADMIN',
    WAREHOUSE_OPERATOR='WAREHOUSE_OPERATOR',
    CUSTOMER='CUSTOMER',
}

export class GetUsersQueryDto{
    @ApiPropertyOptional({
        description:'Lọc user theo role',
        enum: UserRoleFilter,
        example: UserRoleFilter.CUSTOMER,
    })
    @IsOptional()
    @IsEnum(UserRoleFilter)
    role ?: UserRoleFilter;
}

export class CustomerInfoResponseDto{
    @ApiProperty()
    customerCode:string | undefined;
    @ApiPropertyOptional()
    loyaltyPoints?: number;
}

export class AdminInfoResponseDto {
  @ApiProperty({ example: 'ADM-001' })
  employee_code: string | undefined;

  @ApiPropertyOptional({ example: 'IT' })
  department?: string;

  @ApiPropertyOptional({ example: 'Quản trị viên' })
  position?: string;
}

export class WarehouseOperatorInfoResponseDto {
  @ApiProperty({ example: 'WH-001' })
  employee_code: string | undefined;

  @ApiPropertyOptional({ example: 'uuid-kho' })
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'CA_SANG' })
  shift?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  status?: string;
}

export class UserDetailResponseDto{
    @ApiProperty()
    id:string | undefined;

    @ApiProperty()
    email:string | undefined;

    @ApiProperty()
    fullName: string | undefined;

    @ApiPropertyOptional()
    phone?: string;

    @ApiProperty()
    role: string | undefined;

    @ApiProperty()
    status: string | undefined;

    @ApiProperty()
    createdAt: Date | undefined;

    // Dành cho Customer
    @ApiPropertyOptional({ type: CustomerInfoResponseDto })
    customerInfo?: CustomerInfoResponseDto;

     // Dành cho Admin (bổ sung)
    @ApiPropertyOptional({ type: AdminInfoResponseDto })
     adminInfo?: AdminInfoResponseDto;

     // Dành cho Nhân viên kho (bổ sung)
    @ApiPropertyOptional({ type: WarehouseOperatorInfoResponseDto })
    operatorInfo?: WarehouseOperatorInfoResponseDto;
}
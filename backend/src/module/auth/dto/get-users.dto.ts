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

    @ApiPropertyOptional({
        type: CustomerInfoResponseDto,
        description: 'Chỉ hiển thị khi role là CUSTOMER'
    })
    customerInfo?: CustomerInfoResponseDto;
}
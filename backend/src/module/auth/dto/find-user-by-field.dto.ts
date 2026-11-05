import { ApiPropertyOptional } from "@nestjs/swagger";
import{IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator'

// Chỉ được truyền đúng 1 trong 4 trường (service kiểm tra).
export class FindUserByFieldQueryDto{
    @ApiPropertyOptional({ example: 'user@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?:string;

    // phone không UNIQUE dưới DB -> có thể khớp nhiều user, service trả 409.
    @ApiPropertyOptional({ example: '0901234567' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phone?:string;

    @ApiPropertyOptional({ description: 'Mã khách hàng (customers.customer_code)' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    customerCode?:string;

    @ApiPropertyOptional({ description: 'Mã nhân viên của admin hoặc nhân viên kho (employee_code)' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    employeeCode?:string;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import{IsEmail, IsOptional, IsString} from 'class-validator'

export class FindUserByFieldQueryDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?:string;
}
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class GetCustomerByCodeResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    fullName: string;

    @ApiPropertyOptional()
    avatarUrl?: string;

    @ApiPropertyOptional()
    dateOfBirth?: Date;

    @ApiPropertyOptional()
    gender?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    customerCode: string;

    @ApiProperty()
    loyaltyPoints: number;

    @ApiProperty()
    createdAt: Date;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerProfileResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() fullName: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() avatarUrl?: string;
  @ApiPropertyOptional() dateOfBirth?: Date;
  @ApiPropertyOptional() gender?: string;
  @ApiProperty() customerCode: string;
  @ApiProperty() loyaltyPoints: number;
}

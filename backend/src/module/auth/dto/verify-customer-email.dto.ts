import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCustomerEmailDto {
  @ApiProperty({
    example: 'datda92@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  verificationCode!: string;
}

export class VerifyCustomerEmailResponseDto {
  @ApiProperty({
    example: 'Xác thực email thành công',
  })
  message!: string;
}
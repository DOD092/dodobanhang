import {ApiProperty} from '@nestjs/swagger';
import {IsEmail} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example:'datda92@gmail.com'
  })
  @IsEmail()
  email !: string;
}

export class ForgotPasswordResponseDto {
    @ApiProperty({
        example:'If the email exists in our system, we have sent a password reset link to your email address.'
    })
    message !: string;
}
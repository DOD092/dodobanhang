import {ApiProperty} from '@nestjs/swagger';
import{IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'khachhangdat@example.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '583921',
    })
    @IsString()
    @MinLength(6)
    passwordResetCode!: string;

    @ApiProperty({
        example: 'Dothanhdat@123',
    })
    @IsString()
    @MinLength(8)
    newPassword!: string;
}

export class ResetPasswordResponseDto {
    @ApiProperty({
        example:'Your password has been successfully reset.'
    })
    message !: string;
}

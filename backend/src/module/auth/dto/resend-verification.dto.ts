import {IsEmail} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ResendVerificationDto{
    @ApiProperty({
        example:'datda92@gmail.com',
    })
    @IsEmail()
    email !: string;
}

export class ResendVerificationResponseDto{
    @ApiProperty({
        example:'Mã xác thực đã được gửi lại, vui lòng kiểm tra email', 
    })
    message !: string;
}
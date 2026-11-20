import {ApiProperty} from '@nestjs/swagger';
import {IsString, MaxLength, MinLength} from 'class-validator'

export class ChangePasswordDto{
    @ApiProperty({
        example:'OldPassword@123',
    })
    @IsString()
    currentPassword!: string;

    @ApiProperty({
        example:'NewPassword@123',
    })
    @IsString ()
    @MinLength(8)
    @MaxLength(72) // bcrypt chỉ đọc 72 byte đầu (giống CustomerRegisterRequestDto)
    newPassword!: string;
}

export class ChangePasswordResponseDto{
    @ApiProperty({
        example: 'Successfull change', 
    })
    message!: string;
}
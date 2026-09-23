import{ApiProperty} from '@nestjs/swagger';
import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';
import{IsString} from 'class-validator';
import { StringLiteral } from 'typescript';

export class GoogleAuthDto{
    @ApiProperty()
    @IsString()
    credential !: string;
}

export class GoogleAuthResponseDto{
    accessToken !: string;
    user !:{
        id: string;
        email: string;
        fullName: string 
    };
}
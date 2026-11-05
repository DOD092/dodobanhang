import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  // ID token (JWT) do Google Identity Services trả về cho frontend
  // trong callback: response.credential
  @ApiProperty({ description: 'Google ID token (response.credential)' })
  @IsString()
  @IsNotEmpty()
  credential!: string;
}

export class GoogleAuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;
}

export class GoogleAuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ description: 'true nếu lần này vừa tạo tài khoản mới' })
  isNewUser!: boolean;

  @ApiProperty({ type: GoogleAuthUserDto })
  user!: GoogleAuthUserDto;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
} from 'class-validator';
import { RoleName } from '../../../common/enum/role-name.enum';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleName })
  @IsEnum(RoleName)
  name: RoleName;
}

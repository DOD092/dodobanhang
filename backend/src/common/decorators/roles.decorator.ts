import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../enum/role-name.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

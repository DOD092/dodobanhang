import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../enum/role-name.enum';

export const ROLES_KEY = 'roles';

// Gắn lên route/controller: @Roles(RoleName.ADMIN) — RolesGuard sẽ đọc metadata này.
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);

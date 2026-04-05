import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionEnum } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      return false; // Autodecline if no user or user has no roles array
    }

    // Extract all individual permission 'names' from the nested roles -> permissions structure
    const userPermissions = new Set<string>();

    user.roles.forEach((role: any) => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((permission: any) => {
          if (permission.name) {
            userPermissions.add(permission.name);
          }
        });
      }
    });

    // Check if user has all the required permissions (or SOME depending on requirements)
    // Often it is required to have At Least One of the specified permissions (like an OR check)
    // The previous RolesGuard implemented "some". Let's also do "some" for standard RBAC flexibility.
    return requiredPermissions.every((requiredPermission) =>
      userPermissions.has(requiredPermission),
    );
  }
}

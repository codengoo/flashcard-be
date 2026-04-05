export enum PermissionEnum {
  // Settings
  ReadSettings = 'settings:read',
  UpdateSettings = 'settings:modify',

  // Roles
  ModifyRoles = 'roles:modify',
  ReadRoles = 'roles:read',
  AssignRoles = 'roles:assign',

  // Permissions
  ModifyPermissions = 'permissions:modify',
  ReadPermissions = 'permissions:read',
}

export enum PermissionEnum {
  // Settings
  ReadSettingsAdmin = 'read:settings:admin',
  UpdateSettingsAdmin = 'update:settings:admin',

  // Users
  ManageUsers = 'manage:users',

  // Roles
  ModifyRoles = 'roles:modify',
  ReadRoles = 'roles:read',
  AssignRoles = 'roles:assign',

  // Permissions
  ModifyPermissions = 'permissions:modify',
  ReadPermissions = 'permissions:read',
}

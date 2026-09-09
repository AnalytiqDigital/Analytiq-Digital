export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export const ADMIN_WRITABLE_ROLES: ReadonlySet<AdminRole> = new Set(['super_admin', 'admin', 'editor']);
export const ADMIN_MANAGE_SETTINGS_ROLES: ReadonlySet<AdminRole> = new Set(['super_admin', 'admin']);

export function hasAdminAccess(role: string | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'editor' || role === 'viewer';
}

export function requireAdminRole(role: string | undefined, allowedRoles: ReadonlySet<string> | string[] = ADMIN_WRITABLE_ROLES): boolean {
  if (!role) return false;
  const roles = allowedRoles instanceof Set ? allowedRoles : new Set(allowedRoles);
  return roles.has(role);
}

export function requireWriteAccess(role: string | undefined): boolean {
  return requireAdminRole(role, ADMIN_WRITABLE_ROLES);
}

export function canWriteContent(role: string | undefined): boolean {
  return requireWriteAccess(role);
}

export function canManageSettings(role: string | undefined): boolean {
  return requireAdminRole(role, ADMIN_MANAGE_SETTINGS_ROLES);
}

export function requireManageSettings(role: string | undefined): boolean {
  return canManageSettings(role);
}

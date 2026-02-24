// Тема: Type alias, Union types
export type Role = 'admin' | 'manager' | 'user';
export type Permission = 'read' | 'write' | 'delete' | 'manage_users';

// Тема: Record - создаем объект с определенными ключами
export const PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  manager: ['read', 'write', 'delete'],
  user: ['read']
};

// Тема: Type guard
export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

// Тема: Discriminated union для состояний прав
export type PermissionState = 
  | { status: 'checking' }
  | { status: 'granted'; permissions: Permission[] }
  | { status: 'denied'; reason: string };
// Тема: Type alias, Union types
export type Role = 'admin' | 'manager' | 'user';
export type Permission = 'read' | 'write' | 'delete' | 'manage_users';

// Тема: Record - создаем объект с определенными ключами
// Паттерн "Маппинг прав" (Permission Mapping)
// Используем Record для создания типобезопасной таблицы прав
// Преимущества: если добавить новую роль, TypeScript заставит определить права
export const PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  manager: ['read', 'write', 'delete'],
  user: ['read'],
};
// Если случайно пропустить роль, будет ошибка компиляции!

// Тема: Type guard
export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

import { StrictOmit } from './utils';

// Тема: Interface, Union types, Optional fields
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user'; // Union тип
  profile?: {
    // Опциональное поле
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: Date;
  lastLogin?: Date; // Опциональное поле
}

/**
 * Выбираем number для простоты в учебном проекте,
 * но в реальных приложениях чаще используют UUID (string)
 * чтобы избежать коллизий при распределенных системах
 */

/**
 * Выбор подхода для ролей:
 * - Union types: 'admin' | 'manager' | 'user'
 * - Enums: enum Role { ADMIN, MANAGER, USER }
 * 
 * Мы выбрали union types, потому что:
 * 1. Они часть системы типов, а не отдельная сущность
 * 2. Лучшая автоподстановка в IDE
 * 3. Не создают лишнего кода при компиляции в JS
 */

export type RegisterData = StrictOmit<User, 'id' | 'createdAt' | 'lastLogin' | 'role'> & {
  confirmPassword: string;
  role: 'user'; // При регистрации можно только user
};
// Если опечататься в 'createdAt' -> 'createdAt2', будет ошибка!

// Тема: Utility types
export type PublicUser = Omit<User, 'password'>; // Убираем пароль
export type UserProfile = Partial<User>; // Все поля опциональны
export type UserUpdateData = Partial<Omit<User, 'id' | 'createdAt'>>;

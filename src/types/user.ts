// Тема: Interface, Union types, Optional fields
export interface User {
  id: number;
  email: string;
  password: string; // Только для демонстрации! В реальном проекте так нельзя
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

// Тема: Type alias
export type RegisterData = Omit<
  User,
  'id' | 'createdAt' | 'lastLogin' | 'role'
> & {
  confirmPassword?: string;
  role?: 'user'; // При регистрации можно только user
};

// Тема: Utility types
export type PublicUser = Omit<User, 'password'>; // Убираем пароль
export type UserProfile = Partial<User>; // Все поля опциональны
export type UserUpdateData = Partial<Omit<User, 'id' | 'createdAt'>>;

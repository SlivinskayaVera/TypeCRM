import type { User } from '@/types/user';

// Тема: Type assertion для создания тестовых данных
export const initialUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // В реальном проекте так нельзя!
    role: 'admin',
    profile: {
      firstName: 'Админ',
      lastName: 'Системы',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: 2,
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    profile: {
      firstName: 'Менеджер',
      lastName: 'Проектов',
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 3,
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Обычный',
      lastName: 'Пользователь',
    },
    createdAt: new Date('2024-02-01'),
  },
];

// Функция для инициализации данных
export function initializeData() {
  const users = localStorage.getItem('users');

  if (!users) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
    console.log('Тестовые данные загружены');
  }
}

import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { User, RegisterData } from '@/types/user';

const USERS_KEY = 'users';

export const authApi = {
  async login(email: string, password: string): Promise<User | null> {
    const users = await apiGet<User>(USERS_KEY);
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const now = new Date();
      const updatedUser = { ...user, lastLogin: now };
      await apiPut(USERS_KEY, user.id, { lastLogin: now });
      return updatedUser;
    }

    return null;
  },

  async register(data: RegisterData): Promise<User> {
    const { confirmPassword, ...userData } = data; // eslint-disable-line @typescript-eslint/no-unused-vars

    const newUser = await apiPost<User>(USERS_KEY, {
      ...userData,
      role: 'user',
    } as Omit<User, 'id'>);

    return newUser;
  },

  async getCurrentUser(id: number): Promise<User | null> {
    const users = await apiGet<User>(USERS_KEY, id);
    return users[0] || null;
  },

  async get(): Promise<User[]> {
    return apiGet<User>(USERS_KEY);
  },

  // Добавляем put метод
  async put(
    id: number,
    data: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null> {
    return apiPut<User>(USERS_KEY, id, data);
  },

  // Добавляем delete метод
  async delete(id: number): Promise<boolean> {
    // Проверяем, не последний ли это администратор
    const users = await apiGet<User>(USERS_KEY);
    const userToDelete = users.find((u) => u.id === id);

    if (userToDelete?.role === 'admin') {
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (adminCount <= 1) {
        throw new Error('Нельзя удалить последнего администратора');
      }
    }

    return apiDelete(USERS_KEY, id);
  },

  // Добавляем update метод (алиас для put)
  async update(
    id: number,
    data: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null> {
    return this.put(id, data);
  },
};

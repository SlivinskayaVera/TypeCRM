import { useState, useEffect } from 'react';
import { authApi } from '@/api/auth';
import type { User, UserUpdateData } from '@/types/user';

// Тема: Conditional types для разных состояний загрузки
type UseUserResult<T> = T extends true
  ? { user: User; loading: false; error: null }
  : { user: User | null; loading: boolean; error: string | null };

// Тема: Перегрузка с conditional return type
export function useUser(id: number, required: true): UseUserResult<true>;
export function useUser(id?: number, required?: false): UseUserResult<false>;

export function useUser(id?: number, required: boolean = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id && !required) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (!id && required) {
      setError('ID пользователя обязателен');
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        const users = await authApi.get(id!);
        setUser(users[0] || null);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки пользователя');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, required]);

  const updateUser = async (data: UserUpdateData) => {
    if (!user) return null;
    
    try {
      const updated = await authApi.put(user.id, data);
      if (updated) {
        setUser(updated);
      }
      return updated;
    } catch (err) {
      setError('Ошибка обновления пользователя');
      return null;
    }
  };

  return { user, loading, error, updateUser };
}
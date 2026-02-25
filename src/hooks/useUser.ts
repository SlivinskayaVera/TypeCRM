import { useState, useEffect } from 'react';
import { authApi } from '@/api/auth';

// Тема: ПОТОМ ТИПИЗИРУЕМ ⚠️
export function useUser(id?: any, required?: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Функция загрузки
    const loadUser = async () => {
      try {
        setLoading(true);

        // Получаем пользователей
        const users = await authApi.get();

        // Просто берём первого, если нет id
        if (!id) {
          setUser(users[0] || null);
        } else {
          const found = users.find((u: any) => u.id === id);
          setUser(found || null);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки');
        console.log('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const updateUser = async (data: any) => {
    if (!user?.id) return null;

    try {
      const updated = await authApi.put(user.id, data);
      if (updated) {
        setUser(updated);
      }
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { user, loading, error, updateUser };
}

import React, { useState, useCallback, useEffect } from 'react';
import type { PublicUser, RegisterData } from '@/types/user';
import type { Permission } from '@/types/permissions';
import { hasPermission } from '@/types/permissions';
import { authApi } from '@/api/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthContext } from './AuthContextInstance';
import { isAdmin } from '@/utils/roleGuards';

// Тема: Interface для контекста
export interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  isLoading: boolean;
}

// Тема: Type для пропсов провайдера
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storedUserId, setStoredUserId] = useLocalStorage<number | null>(
    'userId',
    null,
  );

  // Загружаем пользователя при монтировании
  useEffect(() => {
    const loadUser = async () => {
      if (storedUserId) {
        try {
          const user = await authApi.getCurrentUser(storedUserId);
          if (user) {
            // Тема: Omit - исключаем пароль
            const { password, ...publicUser } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
            setUser(publicUser);
          } else {
            setStoredUserId(null);
          }
        } catch (error) {
          console.error('Failed to load user', error);
          setStoredUserId(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [storedUserId, setStoredUserId]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const user = await authApi.login(email, password);

        if (user) {
          // Тема: Omit - убираем пароль перед сохранением в state
          const { password: _, ...publicUser } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
          setUser(publicUser);
          setStoredUserId(user.id);
        } else {
          throw new Error('Неверный email или пароль');
        }
      } catch (error) {
        throw error instanceof Error ? error : new Error('Ошибка входа');
      } finally {
        setIsLoading(false);
      }
    },
    [setStoredUserId],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);
      try {
        const user = await authApi.register(data);
        // Тема: Omit - убираем пароль
        const { password: _, ...publicUser } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
        setUser(publicUser);
        setStoredUserId(user.id);
      } catch (error) {
        throw error instanceof Error ? error : new Error('Ошибка регистрации');
      } finally {
        setIsLoading(false);
      }
    },
    [setStoredUserId],
  );

  const logout = useCallback(() => {
    setUser(null);
    setStoredUserId(null);
  }, [setStoredUserId]);

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;

      // Type guard сужает тип, если isAdmin вернет true
      if (isAdmin(user)) {
        // здесь TypeScript знает, что role точно 'admin'
        return true; // админ имеет все права
      }

      return hasPermission(user.role, permission);
    },
    [user],
  );

  // Тема: Value для контекста с сужением типа
  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    hasPermission: checkPermission,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

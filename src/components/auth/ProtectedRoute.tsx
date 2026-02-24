import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Permission } from '@/types/permissions';

// Тема: Union типы для режимов защиты
type ProtectionMode =
  | { type: 'authenticated' } // Просто авторизован
  | { type: 'role'; roles: ('admin' | 'manager' | 'user')[] } // Конкретные роли
  | { type: 'permission'; permission: Permission }; // Конкретное право

interface ProtectedRouteProps {
  children: React.ReactNode;
  protection?: ProtectionMode;
  fallbackPath?: string;
}

// Тема: Компонент с сложной логикой сужения типов
export function ProtectedRoute({
  children,
  protection = { type: 'authenticated' },
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // Не авторизован
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Тема: Discriminated union - проверяем разные типы защиты
  switch (protection.type) {
    case 'authenticated':
      // Просто проверяем, что пользователь есть
      return <>{children}</>;

    case 'role':
      // Тема: Type guard с includes
      if (!protection.roles.includes(user.role)) {
        return <Navigate to='/unauthorized' replace />;
      }
      return <>{children}</>;

    case 'permission':
      // Тема: Проверка прав через функцию
      if (!hasPermission(protection.permission)) {
        return <Navigate to='/unauthorized' replace />;
      }
      return <>{children}</>;

    default:
      // Тема: Exhaustive check - убеждаемся, что обработали все случаи
      return <Navigate to='/unauthorized' replace />;
  }
}

// Тема: Специализированные компоненты для частых случаев
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute protection={{ type: 'role', roles: ['admin'] }}>
      {children}
    </ProtectedRoute>
  );
}

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute protection={{ type: 'role', roles: ['admin', 'manager'] }}>
      {children}
    </ProtectedRoute>
  );
}

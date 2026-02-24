import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, isManager } from '@/utils/roleGuards';

export function DashboardPage() {
  const { user, hasPermission, logout } = useAuth();

  // Тема: Type guard в действии
  if (isAdmin(user)) {
    console.log(
      'Пользователь - администратор, показываем расширенную информацию',
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Дашборд</h1>
        <button onClick={logout}>Выйти</button>
      </div>

      {/* Тема: Сужение типов через optional chaining */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Добро пожаловать, {user?.profile?.firstName || user?.email}!</h2>
        <p>
          Ваша роль: <strong>{user?.role}</strong>
        </p>
      </div>

      {/* Тема: Условный рендеринг на основе прав */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {/* Базовая секция - доступна всем */}
        <Section title='Просмотр данных'>
          <p>Вы можете просматривать информацию</p>
        </Section>

        {/* Секция для редакторов */}
        {hasPermission('write') && (
          <Section title='Редактирование'>
            <p>Вы можете редактировать контент</p>
            <button>Создать запись</button>
          </Section>
        )}

        {/* Секция для администраторов */}
        {isAdmin(user) && (
          <Section title='Управление пользователями'>
            <p>Вы можете управлять пользователями</p>
            <div style={{display: 'flex', gap: '4px'}}>
              <button>Добавить пользователя</button>
              <button>Редактировать роли</button>
            </div>
          </Section>
        )}

        {/* Секция для менеджеров и админов */}
        {isManager(user) && (
          <Section title='Модерация'>
            <p>Вы можете модерировать контент</p>
            <button>Проверить жалобы</button>
          </Section>
        )}
      </div>
    </div>
  );
}

// Вспомогательный компонент
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
}

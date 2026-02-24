import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import type { User } from '@/types/user';
import type { Role } from '@/types/permissions';

export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Тема: ApiClient с дженериком
      const loadedUsers = await authApi.get();
      setUsers(loadedUsers);
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: number, newRole: Role) => {
    await authApi.put(userId, { role: newRole });
    await loadUsers(); // Перезагружаем список
  };

  if (loading) {
    return <div>Загрузка пользователей...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Управление пользователями</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Роль</th>
            <th style={cellStyle}>Имя</th>
            <th style={cellStyle}>Фамилия</th>
            <th style={cellStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={cellStyle}>{u.id}</td>
              <td style={cellStyle}>{u.email}</td>
              <td style={cellStyle}>
                <select
                  value={u.role}
                  onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                  disabled={u.id === user?.id} // Нельзя менять свою роль
                >
                  <option value='user'>User</option>
                  <option value='manager'>Manager</option>
                  <option value='admin'>Admin</option>
                </select>
              </td>
              <td style={cellStyle}>{u.profile?.firstName || '-'}</td>
              <td style={cellStyle}>{u.profile?.lastName || '-'}</td>
              <td style={cellStyle}>
                <button>Редактировать</button>
                <button
                  onClick={() => authApi.delete(u.id)}
                  disabled={u.id === user?.id} // Нельзя удалить себя
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #ddd',
  textAlign: 'left' as const,
};

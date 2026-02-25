import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useUpload } from '@/hooks/useUpload';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDateTime } from '@/utils/dateUtils';
import {
  isImageFile,
  isFileTooBig,
  readFileAsDataURL,
  formatFileSize,
} from '@/utils/fileUtils';

// TODO: нормальные типы ⚠️
export function ProfilePage({ userId }: any) {
  const { user: currentUser } = useAuth();
  const { user, loading, error, updateUser } = useUser(userId);
  const { upload, isUploading } = useUpload();
  const { addNotification } = useNotification();

  const [editMode, setEditMode] = useState<any>({
    profile: false,
    password: false,
    avatar: false,
  });

  const [formData, setFormData] = useState<any>({
    profile: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
    },
    email: user?.email || '',
  });

  const [avatarPreview, setAvatarPreview] = useState<any>(null);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  const toggleEditMode = (field: any) => {
    setEditMode((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(formData);
      toggleEditMode('profile');
      addNotification({
        type: 'success',
        message: 'Профиль обновлён!',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err.message || 'Ошибка обновления',
      });
    }
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация с багами 🐛
    if (!isImageFile(file)) {
      addNotification({
        type: 'error',
        message: 'Выберите изображение',
      });
      return;
    }

    if (isFileTooBig(file, 5 * 1024 * 1024)) {
      addNotification({
        type: 'error',
        message: 'Файл слишком большой',
      });
      return;
    }

    try {
      const preview = await readFileAsDataURL(file);
      setAvatarPreview(preview);
    } catch (err) {
      console.log('Ошибка чтения файла', err);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarPreview) return;

    try {
      await upload(avatarPreview, {
        url: `/users/${user.id}/avatar`,
        onProgress: (p: any) => console.log('Progress:', p),
      });

      // Костыль: обновляем пользователя вручную
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].profile = {
          ...users[userIndex].profile,
          avatar: avatarPreview,
        };
        localStorage.setItem('users', JSON.stringify(users));
      }

      setAvatarPreview(null);
      toggleEditMode('avatar');
      addNotification({
        type: 'success',
        message: 'Аватар обновлён!',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err.message || 'Ошибка загрузки',
      });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Профиль пользователя</h1>

      {/* Секция аватара */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            {avatarPreview || user.profile?.avatar ? (
              <img
                src={avatarPreview || user.profile.avatar}
                alt='Avatar'
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}
              >
                {user.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          <div>
            <h3>
              {user.profile?.firstName || 'Без имени'}{' '}
              {user.profile?.lastName || ''}
            </h3>
            <p>{user.email}</p>
            <p>
              Роль: <strong>{user.role}</strong>
            </p>
            <p>Регистрация: {formatDateTime(user.createdAt)}</p>
          </div>

          <button onClick={() => toggleEditMode('avatar')}>
            {editMode.avatar ? 'Отмена' : 'Сменить аватар'}
          </button>
        </div>

        {editMode.avatar && (
          <div style={{ marginTop: '1rem' }}>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {avatarPreview && (
              <div style={{ marginTop: '1rem' }}>
                <p>Предпросмотр:</p>
                <img
                  src={avatarPreview}
                  alt='Preview'
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
                <button
                  onClick={handleUploadAvatar}
                  disabled={isUploading}
                  style={{ marginLeft: '1rem' }}
                >
                  {isUploading ? 'Загрузка...' : 'Сохранить'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Секция личной информации */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Личная информация</h2>
          <button onClick={() => toggleEditMode('profile')}>
            {editMode.profile ? 'Отмена' : 'Редактировать'}
          </button>
        </div>

        {editMode.profile ? (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Имя:</label>
              <input
                type='text'
                value={formData.profile?.firstName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, firstName: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Фамилия:</label>
              <input
                type='text'
                value={formData.profile?.lastName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, lastName: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Email:</label>
              <input
                type='email'
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <button onClick={handleSaveProfile}>Сохранить</button>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <p>
              <strong>Имя:</strong> {user.profile?.firstName || 'Не указано'}
            </p>
            <p>
              <strong>Фамилия:</strong> {user.profile?.lastName || 'Не указано'}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </section>

      {/* Секция смены пароля */}
      <section style={{ padding: '1.5rem', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Безопасность</h2>
          <button onClick={() => toggleEditMode('password')}>
            {editMode.password ? 'Отмена' : 'Сменить пароль'}
          </button>
        </div>

        {editMode.password && (
          <ChangePassword
            userId={user.id}
            onComplete={() => toggleEditMode('password')}
            addNotification={addNotification}
          />
        )}
      </section>
    </div>
  );
}

// Компонент смены пароля (тоже грязный)
function ChangePassword({ userId, onComplete, addNotification }: any) {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState<any>(null);

  const handleSubmit = async () => {
    // Простейшая валидация
    if (passwords.new !== passwords.confirm) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwords.new.length < 6) {
      setError('Минимум 6 символов');
      return;
    }

    try {
      // Прямая работа с localStorage (костыль!)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);

      if (userIndex !== -1) {
        if (users[userIndex].password !== passwords.current) {
          setError('Неверный пароль');
          return;
        }

        users[userIndex].password = passwords.new;
        localStorage.setItem('users', JSON.stringify(users));
      }

      addNotification({
        type: 'success',
        message: 'Пароль изменён!',
      });
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Текущий пароль:</label>
        <input
          type='password'
          value={passwords.current}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Новый пароль:</label>
        <input
          type='password'
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Подтвердите:</label>
        <input
          type='password'
          value={passwords.confirm}
          onChange={(e) =>
            setPasswords({ ...passwords, confirm: e.target.value })
          }
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <button onClick={handleSubmit}>Сменить пароль</button>
    </div>
  );
}

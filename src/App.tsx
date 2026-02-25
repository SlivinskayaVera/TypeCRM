import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import {
  NotificationProvider,
  NotificationContainer,
} from './contexts/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from './hooks/useAuth';

// TODO: нормальные типы для пропсов ⚠️
function Navigation() {
  // useAuth возвращает any — надо исправить!
  const { user, logout } = useAuth();

  // user может быть null, но мы не проверяем
  return (
    <nav
      style={{
        padding: '1rem',
        backgroundColor: '#333',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>
          Главная
        </Link>

        {/* ⚠️ Нет проверки на user?.role — может упасть! */}
        {user?.role === 'admin' && (
          <Link to='/admin' style={{ color: 'white', textDecoration: 'none' }}>
            Админ панель
          </Link>
        )}

        {/* Добавляем ссылку на профиль */}
        {user && (
          <Link
            to={`/profile/${user.id}`}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Профиль
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* ⚠️ Может упасть, если нет profile или firstName */}
            <span>{user.profile?.firstName || user.email}</span>
            <button onClick={logout}>Выйти</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to='/login'
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Вход
            </Link>
            <Link
              to='/register'
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

// Главный компонент приложения
function AppContent() {
  return (
    <div>
      <Navigation />

      <Routes>
        {/* Публичные маршруты */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Защищенные маршруты */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Маршрут профиля с опциональным ID */}
        <Route
          path='/profile/:id?'
          element={
            <ProtectedRoute>
              {/* ⚠️ ProfilePage ожидает userId, но мы не передаём! */}
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin'
          element={
            <ProtectedRoute>
              {/* ⚠️ Должен быть AdminRoute, но используем обычный ProtectedRoute */}
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/unauthorized'
          element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>403 - Доступ запрещен</h1>
              <p>У вас нет прав для просмотра этой страницы</p>
              <Link to='/'>Вернуться на главную</Link>
            </div>
          }
        />
      </Routes>

      {/* ⚠️ NotificationContainer должен быть здесь, но мы его уже добавили в App */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* ⚠️ NotificationProvider оборачивает всё, но NotificationContainer внутри Routes? */}
        <NotificationProvider>
          <NotificationContainer />
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

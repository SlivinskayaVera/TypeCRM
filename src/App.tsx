import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { useAuth } from '@/hooks/useAuth';

// Компонент навигации
function Navigation() {
  const { user, logout } = useAuth();

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
        {user?.role === 'admin' && (
          <Link to='/admin' style={{ color: 'white', textDecoration: 'none' }}>
            Админ панель
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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

        <Route
          path='/admin'
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
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
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

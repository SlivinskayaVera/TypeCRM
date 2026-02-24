import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { user } = useAuth();

  // Если уже авторизован, перенаправляем на главную
  if (user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div>
      <LoginForm />
      <p style={{ textAlign: 'center' }}>
        Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
      </p>
    </div>
  );
}

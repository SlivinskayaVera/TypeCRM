import { Link, Navigate } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

export function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div>
      <RegisterForm />
      <p style={{ textAlign: 'center' }}>
        Уже есть аккаунт? <Link to='/login'>Войти</Link>
      </p>
    </div>
  );
}

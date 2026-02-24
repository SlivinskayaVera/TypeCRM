import { z } from 'zod';
import { Form } from '@/components/forms/Form';
import { Input } from '@/components/forms/Input';
import { useAuth } from '@/hooks/useAuth';

// Тема: Zod schema с выведением типа
const loginSchema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

// Тема: Вывод типа из Zod схемы
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Вход в систему</h2>

      {/* Тема: Используем render props для доступа к значениям формы */}
      <Form<LoginFormData>
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
        validationSchema={loginSchema}
      >
        {({ values, errors, handleChange }) => (
          <>
            <Input
              label='Email'
              field='email'
              type='email'
              value={values.email}
              error={errors.email}
              onChange={handleChange}
              placeholder='Введите email'
            />

            <Input
              label='Пароль'
              field='password'
              type='password'
              value={values.password}
              error={errors.password}
              onChange={handleChange}
              placeholder='Введите пароль'
            />
          </>
        )}
      </Form>
    </div>
  );
}

import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Form } from '@/components/forms/Form';
import { Input } from '@/components/forms/Input';
import type { RegisterData } from '@/types/user';

// Тема: Сложная схема Zod с кастомной валидацией
const registerSchema = z
  .object({
    email: z.string().email('Некорректный email'),
    password: z
      .string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
    confirmPassword: z
      .string()
      .min(6, 'Подтверждение пароля должно содержать минимум 6 символов'),
    profile: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

// Тема: Вывод типа из Zod
type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register } = useAuth();

  const handleSubmit = async (data: RegisterFormData) => {
    // Тема: Omit - исключаем confirmPassword
    const { confirmPassword, ...registerData } = data; // eslint-disable-line @typescript-eslint/no-unused-vars
    await register(registerData as RegisterData);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Регистрация</h2>

      <Form<RegisterFormData>
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          profile: { firstName: '', lastName: '' },
        }}
        onSubmit={handleSubmit}
        validationSchema={registerSchema}
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

            <Input
              label='Подтвердите пароль'
              field='confirmPassword'
              type='password'
              value={values.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
              placeholder='Повторите пароль'
            />

            <h3>Личные данные (необязательно)</h3>

            <Input
              label='Имя'
              field='profile.firstName'
              type='text'
              value={values.profile?.firstName || ''}
              onChange={handleChange}
              placeholder='Введите имя'
            />

            <Input
              label='Фамилия'
              field='profile.lastName'
              type='text'
              value={values.profile?.lastName || ''}
              onChange={handleChange}
              placeholder='Введите фамилию'
            />
          </>
        )}
      </Form>
    </div>
  );
}

import { useForm } from '@/hooks/useForm';
import type { FormProps, FormValues } from '@/types/forms';

export function Form<T extends FormValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: FormProps<T>) {
  const { values, errors, formState, handleChange, handleSubmit } = useForm<T>(
    initialValues,
    validationSchema,
  );

  const renderStatus = () => {
    switch (formState.status) {
      case 'loading':
        return <p>Загрузка...</p>;
      case 'success':
        return <p style={{ color: 'green' }}>Успешно отправлено!</p>;
      case 'error':
        return <p style={{ color: 'red' }}>Ошибка: {formState.error}</p>;
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      {/* Тема: Render prop для доступа к состоянию формы */}
      {typeof children === 'function'
        ? children({ values, errors, handleChange })
        : children}

      <div style={{ marginTop: '1rem' }}>
        <button type='submit' disabled={formState.status === 'loading'}>
          Отправить
        </button>
      </div>

      {renderStatus()}
    </form>
  );
}

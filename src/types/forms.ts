import { ReactNode } from 'react';
import { z } from 'zod';

// Тема: Discriminated unions
// Используем discriminated union вместо булевых флагов,
// потому что это исключает невозможные состояния
// (не может быть одновременно loading и error)
export type FormState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Тема: Тип для функции-рендера
export type FormRenderProps<T> = {
  values: T;
  errors: ValidationErrors<T>;
  // В идеале здесь должен быть дженерик: <K extends keyof T>(field: K, value: T[K]) => void
  // Но для простоты используем string, так как полный рефакторинг
  // потребует изменений во всем коде форм, что выходит за рамки проекта
  handleChange: (field: string, value: string) => void;
};

// Тема: Mapped types - создаем тип на основе другого типа
export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

// Тема: Базовый тип для форм
export type FormValues = Record<string, unknown>;

// Тема: Утилита для извлечения типа поля
export type FieldType<T, K extends keyof T> = T[K] extends infer U ? U : never;

// Используем T extends FormValues, чтобы гарантировать,
// что данные формы всегда будут объектом.
// FormValues = Record<string, unknown> - это любой объект.
// Альтернатива: можно было бы использовать Record<string, any>,
// но unknown безопаснее, так как требует проверки типа перед использованием.
export interface FormProps<T extends FormValues> {
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
  validationSchema?: z.ZodSchema<T>;
  children: ReactNode | ((props: FormRenderProps<T>) => ReactNode);
}

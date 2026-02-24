import { ReactNode } from 'react';
import { z } from 'zod';

// Тема: Discriminated unions
export type FormState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Тема: Тип для функции-рендера
export type FormRenderProps<T> = {
  values: T;
  errors: ValidationErrors<T>;
  // туту
  handleChange: (field: string, value: string) => void;
};

// Тема: Generics в интерфейсе
export interface FormProps<T> {
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
  validationSchema?: z.ZodSchema<T>;
  children: ReactNode | ((props: FormRenderProps<T>) => ReactNode);
}

// Тема: Mapped types - создаем тип на основе другого типа
export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

// Тема: Базовый тип для форм
export type FormValues = Record<string, unknown>;

// Тема: Утилита для извлечения типа поля
export type FieldType<T, K extends keyof T> = T[K] extends infer U ? U : never;

// Тема: Generics в интерфейсе
export interface FormProps<T extends FormValues> {
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
  validationSchema?: z.ZodSchema<T>;
  children: ReactNode | ((props: FormRenderProps<T>) => ReactNode);
}

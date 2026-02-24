import { useState, useCallback } from 'react';
import { z } from 'zod';
import type {
  ValidationErrors,
  FormState,
  FormValues,
} from '@/types/forms';

// Тема: Type guard для проверки объекта
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Тема: Type guard для проверки существования ключа в объекте
function hasKey<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return isObject(obj) && key in obj;
}

// Тема: Type guard для проверки, что значение можно использовать как объект
function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}

// Тема: Тип для значения формы
export type FormValue = string | number | boolean | Date | null | Record<string, unknown>;

export function useForm<T extends FormValues>(
  initialValues: T,
  schema?: z.ZodSchema<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [formState, setFormState] = useState<FormState<T>>({ status: 'idle' });

  // Тема: Безопасное получение значения по пути
  const getValueByPath = useCallback((path: string): unknown => {
    const parts = path.split('.');
    let current: unknown = values;
    
    for (const part of parts) {
      if (!hasKey(current, part)) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }, [values]);

  // Тема: Функция установки значения по пути
  const setValueByPath = useCallback((path: string, newValue: FormValue): void => {
    setValues(prev => {
      const parts = path.split('.');
      
      const setNestedValue = (
        obj: Record<string, unknown>,
        depth: number
      ): Record<string, unknown> => {
        if (depth === parts.length - 1) {
          return {
            ...obj,
            [parts[depth]]: newValue
          };
        }
        
        const currentPart = parts[depth];
        const currentValue = obj[currentPart];
        
        let nestedObj: Record<string, unknown>;
        
        if (isRecord(currentValue)) {
          nestedObj = { ...currentValue };
        } else {
          nestedObj = {} as Record<string, unknown>;
        }
        
        const updatedNested = setNestedValue(nestedObj, depth + 1);
        
        return {
          ...obj,
          [currentPart]: updatedNested
        };
      };
      
      const rootObj = { ...prev } as Record<string, unknown>;
      const result = setNestedValue(rootObj, 0);
      
      return result as T;
    });
  }, []);

  // Тема: Безопасное получение ошибки по пути
  const getErrorByPath = useCallback((path: string): string | undefined => {
    const parts = path.split('.');
    let current: unknown = errors;
    
    for (const part of parts) {
      if (!hasKey(current, part)) {
        return undefined;
      }
      current = current[part];
    }
    
    return typeof current === 'string' ? current : undefined;
  }, [errors]);

  // Тема: Безопасная очистка ошибки по пути
  const clearErrorByPath = useCallback((path: string): void => {
    setErrors(prev => {
      const parts = path.split('.');
      
      const clearNestedError = (
        obj: Record<string, unknown>,
        depth: number
      ): Record<string, unknown> => {
        if (depth === parts.length - 1) {
          const { [parts[depth]]: _, ...rest } = obj; // eslint-disable-line @typescript-eslint/no-unused-vars
          return rest;
        }
        
        const currentPart = parts[depth];
        const currentValue = obj[currentPart];
        
        if (!isRecord(currentValue)) {
          return obj;
        }
        
        const updatedNested = clearNestedError(currentValue, depth + 1);
        
        return {
          ...obj,
          [currentPart]: updatedNested
        };
      };
      
      const rootObj = { ...prev } as Record<string, unknown>;
      const result = clearNestedError(rootObj, 0);
      
      return result as ValidationErrors<T>;
    });
  }, []);

  // Тема: handleChange с правильным типом
  const handleChange = useCallback((
    path: string,
    value: FormValue,
  ) => {
    setValueByPath(path, value);
    clearErrorByPath(path);
  }, [setValueByPath, clearErrorByPath]);

  // 👇 ИСПРАВЛЕНО: Используем z.ZodError вместо устаревшего ZodIssue
  const processZodErrors = useCallback((error: z.ZodError): ValidationErrors<T> => {
    const result: Record<string, unknown> = {};

    // В Zod v4 ошибки находятся в error.issues
    for (const issue of error.issues) {
      const path = issue.path.join('.');
      const message = issue.message;
      
      if (!path) {
        result._root = message;
        continue;
      }
      
      const parts = path.split('.');
      
      const setErrorAtPath = (
        obj: Record<string, unknown>,
        depth: number
      ): Record<string, unknown> => {
        if (depth === parts.length - 1) {
          return {
            ...obj,
            [parts[depth]]: message
          };
        }
        
        const currentPart = parts[depth];
        const currentValue = obj[currentPart];
        
        const nestedObj = isRecord(currentValue) 
          ? { ...currentValue }
          : {} as Record<string, unknown>;
        
        const updatedNested = setErrorAtPath(nestedObj, depth + 1);
        
        return {
          ...obj,
          [currentPart]: updatedNested
        };
      };
      
      const updated = setErrorAtPath(result, 0);
      Object.assign(result, updated);
    }

    return result as ValidationErrors<T>;
  }, []);

  const validate = useCallback(async (): Promise<boolean> => {
    if (!schema) return true;

    try {
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      // 👇 ИСПРАВЛЕНО: Проверяем на z.ZodError
      if (error instanceof z.ZodError) {
        const validationErrors = processZodErrors(error);
        setErrors(validationErrors);
      }
      return false;
    }
  }, [schema, values, processZodErrors]);

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void>) => {
      setFormState({ status: 'loading' });

      const isValid = await validate();
      if (!isValid) {
        setFormState({
          status: 'error',
          error: 'Пожалуйста, исправьте ошибки в форме',
        });
        return;
      }

      try {
        await onSubmit(values);
        setFormState({ status: 'success', data: values });
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Произошла ошибка';
        
        setFormState({
          status: 'error',
          error: errorMessage,
        });
      }
    },
    [values, validate],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setFormState({ status: 'idle' });
  }, [initialValues]);

  return {
    values,
    errors,
    formState,
    handleChange,
    handleSubmit,
    reset,
    getValueByPath,
    getErrorByPath,
  };
}
// Тема: Обобщенные функции валидации
export function validateRequired<T>(value: T | null | undefined, fieldName: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} обязательно для заполнения`);
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Тема: Перегрузка для разных типов валидации
export function validateLength(value: string, min: number, max: number): boolean;
export function validateLength(value: any[], min: number, max: number): boolean;
export function validateLength(value: string | any[], min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

// Тема: Type guard для проверки наличия поля
export function hasField<T extends object, K extends keyof T>(obj: T, field: K): obj is T & Required<Pick<T, K>> {
  return field in obj && obj[field] !== undefined && obj[field] !== null;
}
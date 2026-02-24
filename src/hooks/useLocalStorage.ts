import { useState, useEffect } from 'react';

// Тема: Generics в хуках
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  // Тема: Type guard для проверки существования окна
  const isBrowser = typeof window !== 'undefined';

  // Тема: Сужение типов с помощью тернарного оператора
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) return initialValue;

    try {
      const item = localStorage.getItem(key);

      // Тема: Сужение типов через проверку на null
      if (item) {
        return JSON.parse(item);
      }

      return initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, storedValue, isBrowser]);

  return [storedValue, setStoredValue];
}

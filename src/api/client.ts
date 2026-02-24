import { Entity } from '@/types/entity';

// Тема: Generic с ограничением (constraint)
export async function apiGet<T extends Entity>(
  storageKey: string,
  id?: number,
): Promise<T[]> {
  const data = localStorage.getItem(storageKey);
  const items: T[] = data ? JSON.parse(data) : [];

  if (id) {
    // TypeScript теперь знает, что у items есть поле id!
    return items.filter((item) => item.id === id);
  }

  return items;
}

export async function apiPost<T extends Entity>(
  storageKey: string,
  data: Omit<T, 'id'>,
  customId?: number,
): Promise<T> {
  const items = await apiGet<T>(storageKey);

  // Тема: Type assertion, но теперь безопаснее
  const newItem = {
    ...data,
    id:
      customId ??
      (items.length > 0
        ? Math.max(...items.map((item) => item.id)) + 1 // Больше не нужно (i as any)
        : 1),
    createdAt: new Date(),
  } as T;

  items.push(newItem);
  localStorage.setItem(storageKey, JSON.stringify(items));
  return newItem;
}

export async function apiPut<T extends Entity>(
  storageKey: string,
  id: number,
  data: Partial<T>,
): Promise<T | null> {
  const items = await apiGet<T>(storageKey);
  const index = items.findIndex((item) => item.id === id); // TypeScript знает про id!

  if (index === -1) return null;

  const updatedItem = { ...items[index], ...data };
  items[index] = updatedItem;
  localStorage.setItem(storageKey, JSON.stringify(items));

  return updatedItem;
}

export async function apiDelete<T extends Entity>(
  storageKey: string,
  id: number,
): Promise<boolean> {
  const items = await apiGet<T>(storageKey);
  const filtered = items.filter((item) => item.id !== id); // И здесь тоже!

  if (filtered.length === items.length) return false;

  localStorage.setItem(storageKey, JSON.stringify(filtered));
  return true;
}

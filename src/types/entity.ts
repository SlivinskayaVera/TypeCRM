// Тема: Базовый интерфейс для всех сущностей с id
export interface Entity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date; // Опциональное поле
}

// Тема: Generic для сущностей с id
export type WithId<T> = T & { id: number };

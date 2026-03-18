// Тема: Базовый интерфейс для всех сущностей с id
export interface Entity {
  readonly id: number;  // id не должен меняться
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date; // Опциональное поле
}

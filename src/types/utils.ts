/**
 * StrictOmit - безопасная версия Omit
 * Проверяет, что удаляемые ключи действительно существуют в типе
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * Пример использования:
 * type Test = StrictOmit<User, 'id'>;  // ✅ OK
 * type Test = StrictOmit<User, 'id2'>; // ❌ Ошибка!
 */

// TODO: перегрузки и проверки ⚠️

// Может упасть, если date невалидный
export function formatDate(date: any) {
  return new Date(date).toLocaleDateString('ru-RU');
}

// Может упасть, если date невалидный
export function formatDateTime(date: any) {
  return new Date(date).toLocaleString('ru-RU');
}

// Сортировка без проверок типов
export function sortByDate(items: any[], getDate: any, ascending = true) {
  return [...items].sort((a, b) => {
    const dateA = new Date(getDate(a)).getTime();
    const dateB = new Date(getDate(b)).getTime();

    if (isNaN(dateA) || isNaN(dateB)) {
      return 0; // Просто игнорируем ошибки 🤷
    }

    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// Проверка на валидность даты — нет type guard
export function isValidDate(date: any) {
  return date instanceof Date && !isNaN(date.getTime());
}

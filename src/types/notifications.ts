// Тема: Discriminated union для разных типов уведомлений
export type Notification =
  | {
      type: 'info';
      message: string;
      duration?: number;
    }
  | {
      type: 'success';
      message: string;
      duration?: number;
    }
  | {
      type: 'warning';
      message: string;
      duration?: number;
      action?: {
        label: string;
        handler: () => void;
      };
    }
  | {
      type: 'error';
      message: string;
      duration?: number;
      error?: Error;
    };

// Тема: Type guard для проверки типа уведомления
export function isErrorNotification(
  notification: Notification,
): notification is Notification & { type: 'error' } {
  return notification.type === 'error';
}

// Тема: Функция с перегрузкой для создания уведомлений
export function createNotification(
  type: 'info' | 'success',
  message: string,
): Notification;
export function createNotification(
  type: 'warning',
  message: string,
  action?: { label: string; handler: () => void },
): Notification;
export function createNotification(
  type: 'error',
  message: string,
  error?: Error,
): Notification;

export function createNotification(
  type: Notification['type'],
  message: string,
  extra?: any,
): Notification {
  const base = { type, message, duration: 5000 };

  switch (type) {
    case 'warning':
      return { ...base, action: extra };
    case 'error':
      return { ...base, error: extra };
    default:
      return base;
  }
}

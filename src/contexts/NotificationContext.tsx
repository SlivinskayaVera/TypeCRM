import React, { createContext, useState, useContext } from 'react';

// TODO: discriminated union
type Notification = {
  type: string; // Почему не union?
  message: string;
  duration?: number;
  action?: any;
};

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 5));

    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== notification));
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (index: any) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

// Компонент для отображения уведомлений
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const getStyle = (type: any) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'error':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      case 'warning':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      default:
        return { backgroundColor: '#d1ecf1', color: '#0c5460' };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px',
      }}
    >
      {notifications.map((n: any, i: any) => (
        <div
          key={i}
          style={{
            padding: '12px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid',
            ...getStyle(n.type),
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{n.type.toUpperCase()}:</strong>
            <button onClick={() => removeNotification(i)}>✕</button>
          </div>
          <div>{n.message}</div>
          {n.action && (
            <button onClick={n.action.handler}>{n.action.label}</button>
          )}
        </div>
      ))}
    </div>
  );
}

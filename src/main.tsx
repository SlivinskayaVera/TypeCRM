import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeData } from './utils/seed';

// Инициализируем тестовые данные
initializeData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

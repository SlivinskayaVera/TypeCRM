import React from 'react';
import type { FormValues } from '@/types/forms';

// Тема: Generics в компонентах
interface InputProps<T extends FormValues, K extends keyof T> {
  label: string;
  field: K; // Теперь field может быть только ключом из T
  value: T[K]; // Тип значения автоматически берется из T
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  onChange: (field: K, value: string) => void; // field тоже типизирован
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input<T extends FormValues, K extends keyof T>({
  label,
  field,
  value,
  error,
  type = 'text',
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: InputProps<T, K>) {
  const getInputValue = (val: T[K]): string => {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return val.toISOString().split('T')[0];
    return String(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div style={{ marginBottom: '1rem', opacity: disabled ? 0.6 : 1 }}>
      <label
        style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
      >
        {label}
        {required && (
          <span style={{ color: 'red', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>

      <input
        type={type}
        value={getInputValue(value)}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: `1px solid ${error ? '#dc3545' : '#ced4da'}`,
          borderRadius: '4px',
          fontSize: '1rem',
          ...(disabled && {
            backgroundColor: '#e9ecef',
            cursor: 'not-allowed',
          }),
        }}
      />

      {error && (
        <p
          style={{
            color: '#dc3545',
            fontSize: '0.875rem',
            marginTop: '0.25rem',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

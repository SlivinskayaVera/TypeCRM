import React from 'react';

interface InputProps {
  label: string;
  field: string;
  value: unknown;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  onChange: (field: string, value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input({
  label,
  field,
  value,
  error,
  type = 'text',
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: InputProps) {
  const getInputValue = (val: unknown): string => {
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

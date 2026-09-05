import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-petrol mb-1">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-lg border border-petrol-200 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-petrol placeholder:text-petrol-300 ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

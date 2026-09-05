import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-heading font-medium transition-colors';

  const variants = {
    primary: 'bg-mint text-petrol hover:bg-mint-500',
    secondary: 'bg-petrol text-white hover:bg-petrol-600',
    outline: 'border-2 border-petrol text-petrol hover:bg-petrol-50',
    ghost: 'text-petrol hover:bg-petrol-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

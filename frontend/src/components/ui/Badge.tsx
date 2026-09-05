interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-petrol-100 text-petrol',
    success: 'bg-mint-100 text-mint-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

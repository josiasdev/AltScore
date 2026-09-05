interface AvatarProps {
  name: string;
  role?: 'tenant' | 'landlord';
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, role = 'tenant', size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const colors = {
    tenant: 'bg-mint text-petrol',
    landlord: 'bg-petrol text-mint',
  };

  return (
    <div
      className={`${sizes[size]} ${colors[role]} rounded-full flex items-center justify-center font-heading font-bold`}
    >
      {initials}
    </div>
  );
}

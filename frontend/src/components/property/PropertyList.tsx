import type { Property } from '../../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onSelect?: (id: number) => void;
}

export function PropertyList({ properties, onSelect }: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onClick={() => onSelect?.(property.id)}
        />
      ))}
    </div>
  );
}

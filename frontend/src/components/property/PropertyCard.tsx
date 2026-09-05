import type { Property } from '../../types';
import { Badge } from '../ui/Badge';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-petrol-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="h-48 bg-petrol-50 flex items-center justify-center relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23E8F2F2" width="400" height="300"/><text fill="%238FBDBF" font-family="sans-serif" font-size="18" x="200" y="150" text-anchor="middle">Sem foto</text></svg>';
          }}
        />
        {property.accepts_altscore && (
          <div className="absolute top-3 right-3">
            <Badge variant="success">Alugue sem fiador</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-semibold text-petrol line-clamp-1">{property.title}</h3>
        </div>
        <p className="text-petrol-400 text-sm mb-1 line-clamp-1">{property.address}</p>
        <p className="text-petrol-300 text-xs mb-3">{property.neighborhood}</p>
        <div className="flex items-center gap-4 text-sm text-petrol-300 mb-3">
          <span>{property.bedrooms} quartos</span>
          <span>{property.bathrooms} banheiros</span>
          <span>{property.area_m2}m²</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-petrol-100">
          <span className="text-xl font-heading font-bold text-mint">
            R$ {property.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-petrol-400">/mês</span>
        </div>
      </div>
    </div>
  );
}

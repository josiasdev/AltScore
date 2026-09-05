import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { Property } from '../types';

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const res = await api.properties.get(Number(id));
      setProperty(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestContract = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setRequesting(true);
    try {
      await api.contracts.create({ property_id: Number(id) });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Erro ao solicitar contrato');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-petrol-400">Carregando...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-petrol-400">Imóvel não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-mint font-medium mb-4 hover:underline"
        >
          ← Voltar
        </button>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="h-64 bg-petrol-50">
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect fill="%23E8F2F2" width="800" height="400"/><text fill="%238FBDBF" font-family="sans-serif" font-size="24" x="400" y="200" text-anchor="middle">Sem foto</text></svg>';
              }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-petrol">{property.title}</h1>
                <p className="text-petrol-400">{property.address}</p>
              </div>
              {property.accepts_altscore && <Badge variant="success">Aceita AltScore</Badge>}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-petrol-100">
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.bedrooms}</p>
                <p className="text-sm text-petrol-400">Quartos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.bathrooms}</p>
                <p className="text-sm text-petrol-400">Banheiros</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.area_m2}m²</p>
                <p className="text-sm text-petrol-400">Área</p>
              </div>
            </div>

            <p className="text-petrol-400 mb-6">{property.description}</p>

            <div className="flex items-center justify-between bg-petrol-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-petrol-400">Aluguel</p>
                <p className="text-3xl font-heading font-bold text-mint">
                  R$ {property.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {success ? (
                <div className="text-center">
                  <p className="text-mint font-medium mb-2">Solicitação enviada!</p>
                  <Button variant="secondary" onClick={() => navigate('/contratos')}>
                    Ver contratos
                  </Button>
                </div>
              ) : (
                <Button onClick={handleRequestContract} disabled={requesting}>
                  {requesting ? 'Enviando...' : 'Solicitar contrato'}
                </Button>
              )}
            </div>

            <div className="mt-4 text-sm text-petrol-400">
              <p>Proprietário: {property.landlord_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

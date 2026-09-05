import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PropertyList } from '../components/property/PropertyList';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { Property } from '../types';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterAltscore, setFilterAltscore] = useState(false);
  const navigate = useNavigate();

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.properties.list();
      setProperties(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterAltscore || p.accepts_altscore;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-petrol mb-6">Imóveis em Quixadá</h1>

        {error && <ErrorBanner message={error} onRetry={loadProperties} />}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por bairro ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-petrol-200 cursor-pointer">
            <input
              type="checkbox"
              checked={filterAltscore}
              onChange={(e) => setFilterAltscore(e.target.checked)}
              className="w-4 h-4 accent-mint"
            />
            <span className="text-sm text-petrol">Aceita AltScore</span>
          </label>
        </div>

        <p className="text-sm text-petrol-400 mb-4">
          {filtered.length} imóvel(is) encontrado(s)
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading font-semibold text-petrol mb-2">Nenhum resultado</h3>
            <p className="text-petrol-400 text-sm">
              {search || filterAltscore
                ? 'Tente buscar por outros termos ou remova os filtros'
                : 'Nenhum imóvel disponível no momento'}
            </p>
          </div>
        ) : (
          <PropertyList properties={filtered} onSelect={(id) => navigate(`/imoveis/${id}`)} />
        )}
      </div>
    </div>
  );
}

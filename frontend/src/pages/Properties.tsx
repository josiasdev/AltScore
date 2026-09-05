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
  const [priceRange, setPriceRange] = useState<string>('all');
  const [neighborhood, setNeighborhood] = useState<string>('all');
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

  const neighborhoods = [...new Set(properties.map(p => p.neighborhood))];

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterAltscore || p.accepts_altscore;
    const matchesNeighborhood = neighborhood === 'all' || p.neighborhood === neighborhood;

    let matchesPrice = true;
    if (priceRange === 'up-to-1000') matchesPrice = p.rent_value <= 1000;
    else if (priceRange === '1000-2000') matchesPrice = p.rent_value > 1000 && p.rent_value <= 2000;
    else if (priceRange === '2000+') matchesPrice = p.rent_value > 2000;

    return matchesSearch && matchesFilter && matchesNeighborhood && matchesPrice;
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
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-petrol mb-2">Imóveis em Quixadá</h1>
          <p className="text-petrol-400">Encontre o imóvel perfeito para você</p>
        </div>

        {error && <ErrorBanner message={error} onRetry={loadProperties} />}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Buscar por bairro, nome ou endereço..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-petrol-200 focus:outline-none focus:ring-2 focus:ring-mint text-petrol"
              >
                <option value="all">Todos os bairros</option>
                {neighborhoods.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-petrol-200 focus:outline-none focus:ring-2 focus:ring-mint text-petrol"
              >
                <option value="all">Qualquer preço</option>
                <option value="up-to-1000">Até R$ 1.000</option>
                <option value="1000-2000">R$ 1.000 - R$ 2.000</option>
                <option value="2000+">Acima de R$ 2.000</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterAltscore}
                onChange={(e) => setFilterAltscore(e.target.checked)}
                className="w-4 h-4 accent-mint"
              />
              <span className="text-sm text-petrol">Apenas imóveis que aceitam AltScore</span>
            </label>
            {(search || filterAltscore || neighborhood !== 'all' || priceRange !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterAltscore(false);
                  setNeighborhood('all');
                  setPriceRange('all');
                }}
                className="text-sm text-mint hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-petrol-400 mb-4">
          {filtered.length} imóvel(is) encontrado(s)
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading font-semibold text-petrol mb-2">Nenhum resultado</h3>
            <p className="text-petrol-400 text-sm">
              {search || filterAltscore || neighborhood !== 'all' || priceRange !== 'all'
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

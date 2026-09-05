import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PropertyList } from '../components/property/PropertyList';
import { Input } from '../components/ui/Input';
import type { Property } from '../types';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAltscore, setFilterAltscore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const res = await api.properties.list();
      setProperties(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterAltscore || p.accepts_altscore;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-petrol-400">Carregando imóveis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-petrol mb-6">Imóveis em Quixadá</h1>

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

        <PropertyList properties={filtered} onSelect={(id) => navigate(`/imoveis/${id}`)} />
      </div>
    </div>
  );
}

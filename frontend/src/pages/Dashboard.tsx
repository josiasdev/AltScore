import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import { PropertyCard } from '../components/property/PropertyCard';
import { Card } from '../components/ui/Card';
import type { Property, Score } from '../types';

export function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [score, setScore] = useState<Score | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      try {
        const [scoreRes, propertiesRes] = await Promise.all([
          api.score.get().catch(() => null),
          api.properties.list(),
        ]);
        if (scoreRes) setScore(scoreRes);
        setProperties(propertiesRes.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-petrol-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-petrol">
            Olá, {user?.full_name || 'Usuário'}
          </h1>
          <p className="text-petrol-400">Bem-vindo ao seu painel AltScore</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Score */}
          <Card className="lg:col-span-1">
            <h2 className="font-heading font-semibold mb-4">Seu Score</h2>
            {score ? (
              <ScoreDisplay score={score.total} level={score.level} showDetails />
            ) : (
              <div className="text-center py-8">
                <p className="text-petrol-400 mb-4">Você ainda não tem um score</p>
                <button
                  onClick={async () => {
                    const res = await api.score.calculate();
                    setScore(res);
                  }}
                  className="text-mint font-medium hover:underline"
                >
                  Calcular meu score
                </button>
              </div>
            )}
          </Card>

          {/* Quick stats */}
          <Card className="lg:col-span-2">
            <h2 className="font-heading font-semibold mb-4">Resumo</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-petrol-50 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-mint">
                  {score?.connected_sources?.length || 0}
                </p>
                <p className="text-sm text-petrol-400">Fontes conectadas</p>
              </div>
              <div className="bg-petrol-50 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-mint">0</p>
                <p className="text-sm text-petrol-400">Contratos ativos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-xl text-petrol">Imóveis recomendados</h2>
            <button
              onClick={() => navigate('/imoveis')}
              className="text-mint font-medium hover:underline text-sm"
            >
              Ver todos
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => navigate(`/imoveis/${p.id}`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

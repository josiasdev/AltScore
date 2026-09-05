import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import { PropertyCard } from '../components/property/PropertyCard';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { Property, Score, Contract } from '../types';

export function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [score, setScore] = useState<Score | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [scoreRes, propertiesRes, contractsRes] = await Promise.all([
        api.score.get().catch(() => null),
        api.properties.list(),
        api.contracts.list().catch(() => []),
      ]);
      if (scoreRes) setScore(scoreRes);
      setProperties(propertiesRes.slice(0, 3));
      setContracts(contractsRes);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeContracts = contracts.filter(c => c.status === 'active');
  const pendingContracts = contracts.filter(c => c.status === 'pending');

  const dataSources = [
    { id: 'pix', label: 'Pix', icon: '💳', connected: score?.connected_sources?.includes('pix') },
    { id: 'subscriptions', label: 'Assinaturas', icon: '📱', connected: score?.connected_sources?.includes('subscriptions') },
    { id: 'open_finance', label: 'Open Finance', icon: '🏦', connected: score?.connected_sources?.includes('open_finance') },
  ];

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar name={user?.full_name || 'Usuário'} role={user?.role} size="lg" />
            <div>
              <h1 className="text-3xl font-heading font-bold text-petrol">
                Olá, {user?.full_name?.split(' ')[0] || 'Usuário'}
              </h1>
              <p className="text-petrol-400">Bem-vindo ao seu painel AltScore</p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={loadData} />}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Score */}
          <Card className="lg:col-span-1">
            <h2 className="font-heading font-semibold mb-4">Seu Score</h2>
            {score ? (
              <ScoreDisplay score={score.total} level={score.level} showDetails />
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📊</div>
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

          {/* Data Sources */}
          <Card className="lg:col-span-1">
            <h2 className="font-heading font-semibold mb-4">Fontes de Dados</h2>
            <div className="space-y-3">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    source.connected ? 'bg-mint-50 border border-mint' : 'bg-petrol-50 border border-petrol-200'
                  }`}
                >
                  <span className="text-xl">{source.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-petrol">{source.label}</p>
                    <p className="text-xs text-petrol-400">
                      {source.connected ? 'Conectado' : 'Não conectado'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${source.connected ? 'bg-mint' : 'bg-petrol-200'}`} />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/score')}
              className="mt-4 w-full text-center text-mint font-medium text-sm hover:underline"
            >
              Conectar nova fonte de dados →
            </button>
          </Card>

          {/* Stats */}
          <Card className="lg:col-span-1">
            <h2 className="font-heading font-semibold mb-4">Resumo</h2>
            <div className="space-y-4">
              <div className="bg-petrol-50 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-mint">
                  {activeContracts.length}
                </p>
                <p className="text-sm text-petrol-400">Contratos ativos</p>
              </div>
              <div className="bg-petrol-50 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-orange-500">
                  {pendingContracts.length}
                </p>
                <p className="text-sm text-petrol-400">Contratos pendentes</p>
              </div>
              <div className="bg-petrol-50 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-mint">
                  {contracts.length}
                </p>
                <p className="text-sm text-petrol-400">Total de contratos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Contracts */}
        {activeContracts.length > 0 && (
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-xl text-petrol">Contratos Ativos</h2>
              <button
                onClick={() => navigate('/contratos')}
                className="text-mint font-medium hover:underline text-sm"
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-3">
              {activeContracts.slice(0, 2).map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => navigate(`/contratos/${contract.id}`)}
                  className="flex items-center justify-between bg-petrol-50 rounded-lg p-4 cursor-pointer hover:bg-petrol-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-petrol">{contract.property_title}</p>
                    <p className="text-sm text-petrol-400">
                      R$ {contract.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-sm font-medium">
                    Ativo
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommended Properties */}
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
          {properties.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-petrol-400">Nenhum imóvel disponível no momento</p>
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} onClick={() => navigate(`/imoveis/${p.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

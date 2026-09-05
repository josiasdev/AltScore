import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import { ScoreBreakdownComponent } from '../components/score/ScoreBreakdown';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Score } from '../types';

export function ScorePage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['pix', 'subscriptions', 'open_finance']);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadScore();
  }, [isAuthenticated, navigate]);

  const loadScore = async () => {
    try {
      const res = await api.score.get();
      setScore(res);
    } catch {
      // Score ainda não calculado
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const res = await api.score.calculate();
      setScore(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const simulateScore = async () => {
    setCalculating(true);
    try {
      const res = await api.score.simulate(selectedSources);
      setScore(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <p className="text-petrol-400">Carregando...</p>
      </div>
    );
  }

  const dataSources = [
    { id: 'pix', label: 'Pix', icon: '💳', desc: 'Histórico de transações Pix', weight: '40%' },
    { id: 'subscriptions', label: 'Assinaturas', icon: '📱', desc: 'Pagamentos recorrentes', weight: '15%' },
    { id: 'open_finance', label: 'Open Finance', icon: '🏦', desc: 'Dados bancários integrados', weight: '25%' },
  ];

  const badges = [
    { id: 'first_score', label: 'Primeiro Score', icon: '🎯', unlocked: !!score },
    { id: 'high_score', label: 'Score Alto', icon: '⭐', unlocked: (score?.total || 0) >= 700 },
    { id: 'all_sources', label: 'Todas as Fontes', icon: '🔗', unlocked: (score?.connected_sources?.length || 0) >= 3 },
    { id: 'on_chain', label: 'Registrado na Chain', icon: '⛓️', unlocked: !!score },
  ];

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-petrol mb-8">Seu Score AltScore</h1>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Score Display */}
          <Card>
            {score ? (
              <ScoreDisplay score={score.total} level={score.level} />
            ) : (
              <div className="text-center py-8">
                <p className="text-petrol-400 mb-4">Calcule seu score para ver os detalhes</p>
                <Button onClick={handleCalculate} disabled={calculating}>
                  {calculating ? 'Calculando...' : 'Calcular Score'}
                </Button>
              </div>
            )}
          </Card>

          {/* Breakdown */}
          <Card>
            {score ? (
              <ScoreBreakdownComponent breakdown={score.breakdown} />
            ) : (
              <div className="text-center py-8">
                <h3 className="font-heading font-semibold mb-2">Como funciona?</h3>
                <ul className="text-sm text-petrol-400 space-y-2 text-left">
                  <li>• Histórico de pagamento (40%)</li>
                  <li>• Consistência de renda (25%)</li>
                  <li>• Dados open finance (20%)</li>
                  <li>• Avaliação social (15%)</li>
                </ul>
              </div>
            )}
          </Card>
        </div>

        {/* Simulator */}
        <Card className="mb-8">
          <h2 className="font-heading font-semibold mb-4">Simulador de Score</h2>
          <p className="text-petrol-400 text-sm mb-4">
            Conecte mais fontes de dados para aumentar seu score. Selecione abaixo quais fontes deseja simular:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {dataSources.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              const isConnected = score?.connected_sources?.includes(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-mint bg-mint-50'
                      : 'border-petrol-200 bg-white hover:border-petrol-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{source.icon}</span>
                    {isConnected && (
                      <span className="px-2 py-1 bg-mint text-petrol text-xs rounded-full font-medium">
                        Conectado
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-petrol">{source.label}</p>
                  <p className="text-xs text-petrol-400">{source.desc}</p>
                  <p className="text-xs text-mint font-medium mt-1">Peso: {source.weight}</p>
                </button>
              );
            })}
          </div>
          <Button onClick={simulateScore} disabled={calculating} fullWidth>
            {calculating ? 'Simulando...' : 'Simular Score com Fontes Selecionadas'}
          </Button>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <h2 className="font-heading font-semibold mb-4">Badges de Conquista</h2>
          <p className="text-petrol-400 text-sm mb-4">
            Badges registradas na blockchain Solana como prova das suas conquistas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center ${
                  badge.unlocked
                    ? 'bg-mint-50 border-2 border-mint'
                    : 'bg-petrol-50 border-2 border-petrol-200 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-medium text-sm text-petrol">{badge.label}</p>
                {badge.unlocked && (
                  <p className="text-xs text-mint font-medium mt-1">Desbloqueado</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Connected Sources */}
        <Card>
          <h2 className="font-heading font-semibold mb-4">Fontes de dados conectadas</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {dataSources.map((source) => {
              const isConnected = score?.connected_sources?.includes(source.id);
              return (
                <div
                  key={source.id}
                  className={`p-4 rounded-lg border ${
                    isConnected
                      ? 'border-mint bg-mint-50'
                      : 'border-petrol-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-mint' : 'bg-petrol-200'
                      }`}
                    />
                    <span className="font-medium text-sm">{source.label}</span>
                  </div>
                  <p className="text-xs text-petrol-400">{source.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

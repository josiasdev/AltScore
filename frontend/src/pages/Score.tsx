import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import { ScoreBreakdownComponent } from '../components/score/ScoreBreakdown';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Score } from '../types';

export function ScorePage() {
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadScore();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-petrol-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-petrol mb-8">Seu Score AltScore</h1>

        <div className="grid lg:grid-cols-2 gap-6">
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

        {/* Connected sources */}
        <Card className="mt-6">
          <h2 className="font-heading font-semibold mb-4">Fontes de dados conectadas</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { id: 'pix', label: 'Pix', desc: 'Histórico de transações' },
              { id: 'subscriptions', label: 'Assinaturas', desc: 'Pagamentos recorrentes' },
              { id: 'open_finance', label: 'Open Finance', desc: 'Dados bancários' },
            ].map((source) => {
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

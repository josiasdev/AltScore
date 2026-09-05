import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import type { Contract, Score } from '../types';

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate, id]);

  const loadData = async () => {
    try {
      const contractsRes = await api.contracts.list();
      const found = contractsRes.find((c: Contract) => c.id === Number(id));
      setContract(found || null);

      const scoreRes = await api.score.get().catch(() => null);
      if (scoreRes) setScore(scoreRes);

      // Simulated payment history
      if (found && found.status === 'active') {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
        const mockPayments = months.slice(0, Math.floor(Math.random() * 4) + 1).map((month, i) => ({
          id: i + 1,
          month,
          year: 2026,
          amount: found.rent_value,
          status: i < 3 ? 'paid' : 'pending',
          date: `2026-${String(i + 1).padStart(2, '0')}-05`,
          solana_tx: `tx_${Math.random().toString(36).slice(2, 10)}`,
        }));
        setPayments(mockPayments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="font-heading font-semibold text-petrol mb-2">Contrato não encontrado</h2>
          <Button variant="ghost" onClick={() => navigate('/contratos')}>
            ← Voltar para contratos
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: 'Pendente', variant: 'warning' as const, description: 'Aguardando aprovação do proprietário' },
    active: { label: 'Ativo', variant: 'success' as const, description: 'Contrato em andamento' },
    completed: { label: 'Concluído', variant: 'default' as const, description: 'Contrato finalizado' },
    cancelled: { label: 'Cancelado', variant: 'default' as const, description: 'Contrato cancelado' },
  };

  const config = statusConfig[contract.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-mint font-medium mb-4 hover:underline"
        >
          ← Voltar
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-heading font-bold text-petrol">Contrato #{contract.id}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-petrol-400">{config.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Contract Info */}
          <Card>
            <h2 className="font-heading font-semibold mb-4">Dados do Contrato</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-petrol-100">
                <span className="text-petrol-400">Imóvel</span>
                <span className="font-medium text-petrol">{contract.property_title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-petrol-100">
                <span className="text-petrol-400">Valor do aluguel</span>
                <span className="font-medium text-mint">
                  R$ {contract.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-petrol-100">
                <span className="text-petrol-400">Data de início</span>
                <span className="text-petrol">
                  {new Date(contract.start_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-petrol-400">Status</span>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
            </div>
          </Card>

          {/* Solana Info */}
          <Card>
            <h2 className="font-heading font-semibold mb-4">Registro na Solana</h2>
            {contract.solana_tx_hash ? (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-petrol-100">
                  <span className="text-petrol-400">Transaction Hash</span>
                  <span className="font-mono text-xs text-mint truncate max-w-[180px]">
                    {contract.solana_tx_hash}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-petrol-100">
                  <span className="text-petrol-400">Rede</span>
                  <span className="text-petrol">Solana Devnet</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-petrol-400">Status</span>
                  <span className="text-mint font-medium">Registrado</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⛓️</div>
                <p className="text-petrol-400 mb-2">Contrato será registrado na blockchain</p>
                <p className="text-xs text-petrol-300">
                  O registro será realizado automaticamente ao ativar o contrato
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Real-time Score */}
        {contract.status === 'active' && score && (
          <Card className="mb-8">
            <h2 className="font-heading font-semibold mb-4">Score em Tempo Real</h2>
            <p className="text-petrol-400 text-sm mb-4">
              Seu score é atualizado com base nos pagamentos deste contrato
            </p>
            <div className="flex items-center gap-6">
              <ScoreDisplay score={score.total} level={score.level} />
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-petrol-400">Pagamentos em dia</span>
                    <span className="text-mint font-medium">
                      {payments.filter(p => p.status === 'paid').length} / {payments.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-petrol-400">Histórico de pagamento</span>
                    <span className="font-medium text-petrol">{score.breakdown.payment} / 400</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <Card>
            <h2 className="font-heading font-semibold mb-4">Histórico de Pagamentos</h2>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between bg-petrol-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'paid' ? 'bg-mint' : 'bg-orange-100'
                    }`}>
                      {payment.status === 'paid' ? '✓' : '⏳'}
                    </div>
                    <div>
                      <p className="font-medium text-petrol">
                        {payment.month} / {payment.year}
                      </p>
                      <p className="text-sm text-petrol-400">
                        Pago em {new Date(payment.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-mint">
                      R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {payment.solana_tx && (
                      <p className="text-xs text-petrol-300 font-mono">
                        tx: {payment.solana_tx.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

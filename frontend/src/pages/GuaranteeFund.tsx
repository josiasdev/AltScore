import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

interface FundStatus {
  is_active: boolean;
  total_deposits: number;
  total_coverage_used: number;
  available_balance: number;
  coverage_limit: number;
  fee_percentage: number;
  min_score_required: number;
  total_claims: number;
  approved_claims: number;
  pending_claims: number;
}

interface FundHistory {
  id: number;
  type: 'deposit' | 'claim';
  amount: number;
  fee?: number;
  payout?: number;
  contract_id?: number;
  user: string;
  timestamp: string;
}

interface FundRules {
  coverage_limit: { value: number; description: string };
  fee_percentage: { value: number; description: string };
  min_score_required: { value: number; description: string };
  eligible_claims: string[];
  claim_process: string[];
  transparency: string;
}

export function GuaranteeFund() {
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<FundStatus | null>(null);
  const [history, setHistory] = useState<FundHistory[]>([]);
  const [rules, setRules] = useState<FundRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rules'>('overview');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [statusRes, historyRes, rulesRes] = await Promise.all([
        fetch('/api/fund/status').then(r => r.json()),
        fetch('/api/fund/history').then(r => r.json()),
        fetch('/api/fund/rules').then(r => r.json()),
      ]);
      setStatus(statusRes);
      setHistory(historyRes);
      setRules(rulesRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatLamports = (lamports: number) => {
    const sol = lamports / 1_000_000_000;
    return `${sol.toFixed(2)} SOL`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Usuário não logado - mostrar apenas CTA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-petrol-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-petrol mb-4">Fundo Garantidor</h1>
            <p className="text-xl text-petrol-400 mb-8">
              Smart contract na blockchain Solana para cobertura de inadimplência
            </p>
          </div>

          <Card className="mb-8">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-heading font-bold text-petrol mb-4">
                Acesse o Fundo Garantidor
              </h2>
              <p className="text-petrol-400 mb-6 max-w-md mx-auto">
                Para visualizar os dados do fundo, fazer depósitos ou reivindicar coberturas,
                faça login ou crie sua conta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg">Fazer Login</Button>
                </Link>
                <Link to="/cadastro">
                  <Button variant="outline" size="lg">Criar Conta</Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-heading font-semibold mb-2 text-petrol">Proteção</h3>
                <p className="text-sm text-petrol-400">
                  Cobertura contra inadimplência para proprietários
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">⛓️</div>
                <h3 className="font-heading font-semibold mb-2 text-petrol">Blockchain</h3>
                <p className="text-sm text-petrol-400">
                  Todas as transações são auditáveis na Solana
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-heading font-semibold mb-2 text-petrol">Automático</h3>
                <p className="text-sm text-petrol-400">
                  Smart contract executa regras sem intermediários
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Usuário logado - mostrar dados completos
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
          <h1 className="text-3xl font-heading font-bold text-petrol mb-2">Fundo Garantidor</h1>
          <p className="text-petrol-400">Smart contract na blockchain Solana para cobertura de inadimplência</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-mint text-petrol'
                : 'bg-white text-petrol-400 hover:bg-petrol-50'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-mint text-petrol'
                : 'bg-white text-petrol-400 hover:bg-petrol-50'
            }`}
          >
            Histórico
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'rules'
                ? 'bg-mint text-petrol'
                : 'bg-white text-petrol-400 hover:bg-petrol-50'
            }`}
          >
            Regras
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && status && (
          <>
            {/* Status Badge */}
            <div className="mb-6">
              <Badge variant={status.is_active ? 'success' : 'warning'}>
                {status.is_active ? 'Fundo Ativo' : 'Fundo Pausado'}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <p className="text-sm text-petrol-400 mb-1">Saldo Disponível</p>
                <p className="text-2xl font-heading font-bold text-mint">
                  {formatLamports(status.available_balance)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-petrol-400 mb-1">Total Depositado</p>
                <p className="text-2xl font-heading font-bold text-petrol">
                  {formatLamports(status.total_deposits)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-petrol-400 mb-1">Cobertura Utilizada</p>
                <p className="text-2xl font-heading font-bold text-orange-500">
                  {formatLamports(status.total_coverage_used)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-petrol-400 mb-1">Claims Realizados</p>
                <p className="text-2xl font-heading font-bold text-petrol">
                  {status.total_claims}
                </p>
              </Card>
            </div>

            {/* Fund Parameters */}
            <Card className="mb-8">
              <h2 className="font-heading font-semibold mb-4">Parâmetros do Fundo</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="text-sm text-petrol-400 mb-1">Limite por Contrato</p>
                  <p className="font-heading font-bold text-petrol">
                    {formatLamports(status.coverage_limit)}
                  </p>
                </div>
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="text-sm text-petrol-400 mb-1">Taxa de Administração</p>
                  <p className="font-heading font-bold text-petrol">
                    {status.fee_percentage / 100}%
                  </p>
                </div>
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="text-sm text-petrol-400 mb-1">Score Mínimo</p>
                  <p className="font-heading font-bold text-petrol">
                    {status.min_score_required}
                  </p>
                </div>
              </div>
            </Card>

            {/* Claims Summary */}
            <Card>
              <h2 className="font-heading font-semibold mb-4">Resumo de Claims</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-heading font-bold text-green-600">
                    {status.approved_claims}
                  </p>
                  <p className="text-sm text-petrol-400">Aprovados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-heading font-bold text-yellow-600">
                    {status.pending_claims}
                  </p>
                  <p className="text-sm text-petrol-400">Pendentes</p>
                </div>
                <div className="text-center p-4 bg-petrol-50 rounded-lg">
                  <p className="text-3xl font-heading font-bold text-petrol">
                    {status.total_claims - status.approved_claims - status.pending_claims}
                  </p>
                  <p className="text-sm text-petrol-400">Rejeitados</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <h2 className="font-heading font-semibold mb-4">Histórico de Transações</h2>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-petrol-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'deposit' ? 'bg-mint' : 'bg-orange-100'
                    }`}>
                      {item.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-medium text-petrol">
                        {item.type === 'deposit' ? 'Depósito' : 'Reivindicação'}
                      </p>
                      <p className="text-sm text-petrol-400">
                        {item.user} • {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-heading font-bold ${
                      item.type === 'deposit' ? 'text-mint' : 'text-orange-500'
                    }`}>
                      {item.type === 'deposit' ? '+' : '-'}{formatLamports(item.amount)}
                    </p>
                    {item.payout && (
                      <p className="text-xs text-petrol-400">
                        Pago: {formatLamports(item.payout)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && rules && (
          <>
            <Card className="mb-6">
              <h2 className="font-heading font-semibold mb-4">Como Funciona o Fundo</h2>
              <p className="text-petrol-400 mb-6">{rules.transparency}</p>
              
              <h3 className="font-heading font-semibold mb-3">Parâmetros</h3>
              <div className="space-y-3 mb-6">
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="font-medium text-petrol">{rules.coverage_limit.description}</p>
                  <p className="text-sm text-petrol-400">Valor: {formatLamports(rules.coverage_limit.value)}</p>
                </div>
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="font-medium text-petrol">{rules.fee_percentage.description}</p>
                  <p className="text-sm text-petrol-400">Valor: {rules.fee_percentage.value / 100}%</p>
                </div>
                <div className="bg-petrol-50 rounded-lg p-4">
                  <p className="font-medium text-petrol">{rules.min_score_required.description}</p>
                  <p className="text-sm text-petrol-400">Valor: {rules.min_score_required.value}</p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-heading font-semibold mb-3">Coberturas Elegíveis</h3>
                <ul className="space-y-2">
                  {rules.eligible_claims.map((claim, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-petrol-400">
                      <span className="text-mint mt-1">•</span>
                      {claim}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="font-heading font-semibold mb-3">Processo de Claim</h3>
                <ol className="space-y-2">
                  {rules.claim_process.map((step, i) => (
                    <li key={i} className="text-sm text-petrol-400">
                      {step}
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

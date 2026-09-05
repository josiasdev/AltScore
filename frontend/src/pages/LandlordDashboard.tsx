import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function LandlordDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'landlord') {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      try {
        const [propsRes, contractsRes] = await Promise.all([
          api.landlord.properties(),
          api.landlord.contracts(),
        ]);
        setProperties(propsRes);
        setContracts(contractsRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, navigate]);

  const handleAccept = async (contractId: number) => {
    try {
      await api.landlord.acceptContract(contractId);
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, status: 'active' } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (contractId: number) => {
    try {
      await api.landlord.rejectContract(contractId);
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, status: 'cancelled' } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const pendingContracts = contracts.filter((c) => c.status === 'pending');
  const activeContracts = contracts.filter((c) => c.status === 'active');

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
            Painel do Proprietário
          </h1>
          <p className="text-petrol-400">Gerencie seus imóveis e contratos</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <p className="text-3xl font-heading font-bold text-mint">{properties.length}</p>
            <p className="text-sm text-petrol-400">Imóveis</p>
          </Card>
          <Card>
            <p className="text-3xl font-heading font-bold text-orange-500">{pendingContracts.length}</p>
            <p className="text-sm text-petrol-400">Pendentes</p>
          </Card>
          <Card>
            <p className="text-3xl font-heading font-bold text-green-600">{activeContracts.length}</p>
            <p className="text-sm text-petrol-400">Ativos</p>
          </Card>
        </div>

        {/* Properties */}
        <Card className="mb-8">
          <h2 className="font-heading font-semibold text-lg mb-4">Meus Imóveis</h2>
          {properties.length === 0 ? (
            <p className="text-petrol-400 text-sm">Nenhum imóvel cadastrado</p>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-petrol-50 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-petrol">{p.title}</p>
                    <p className="text-sm text-petrol-400">{p.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-mint">R$ {p.rent_value}</p>
                    <p className="text-xs text-petrol-400">{p.contracts_count} contrato(s)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Contracts */}
        <Card className="mb-8">
          <h2 className="font-heading font-semibold text-lg mb-4">
            Contratos Pendentes
            {pendingContracts.length > 0 && (
              <Badge variant="warning">{pendingContracts.length}</Badge>
            )}
          </h2>
          {pendingContracts.length === 0 ? (
            <p className="text-petrol-400 text-sm">Nenhum contrato pendente</p>
          ) : (
            <div className="space-y-3">
              {pendingContracts.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-petrol-50 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-petrol">{c.property_title}</p>
                    <p className="text-sm text-petrol-400">
                      Inquilino #{c.tenant_id} — R$ {c.rent_value}/mês
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(c.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => handleAccept(c.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aceitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Contracts */}
        <Card>
          <h2 className="font-heading font-semibold text-lg mb-4">Contratos Ativos</h2>
          {activeContracts.length === 0 ? (
            <p className="text-petrol-400 text-sm">Nenhum contrato ativo</p>
          ) : (
            <div className="space-y-3">
              {activeContracts.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-petrol-50 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-petrol">{c.property_title}</p>
                    <p className="text-sm text-petrol-400">
                      Inquilino #{c.tenant_id} — R$ {c.rent_value}/mês
                    </p>
                  </div>
                  <Badge variant="success">Ativo</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

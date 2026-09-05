import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ContractCard } from '../components/contract/ContractCard';
import type { Contract } from '../types';

export function Contracts() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    loadContracts();
  }, [isAuthenticated, navigate]);

  const loadContracts = async () => {
    try {
      const res = await api.contracts.list();
      setContracts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-heading font-bold text-petrol mb-8">Meus Contratos</h1>

        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-petrol-400 mb-4">Você ainda não tem contratos</p>
            <button
              onClick={() => navigate('/imoveis')}
              className="text-mint font-medium hover:underline"
            >
              Explorar imóveis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

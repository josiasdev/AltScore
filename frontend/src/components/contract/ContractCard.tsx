import type { Contract } from '../../types';
import { Badge } from '../ui/Badge';

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const statusConfig = {
    pending: { label: 'Pendente', variant: 'warning' as const },
    active: { label: 'Ativo', variant: 'success' as const },
    completed: { label: 'Concluído', variant: 'default' as const },
    cancelled: { label: 'Cancelado', variant: 'default' as const },
  };

  const { label, variant } = statusConfig[contract.status];

  return (
    <div className="bg-white rounded-xl border border-petrol-100 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading font-semibold text-petrol">{contract.property_title}</h3>
        <Badge variant={variant}>{label}</Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-petrol-400">Valor do aluguel</span>
          <span className="font-medium text-petrol">
            R$ {contract.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-petrol-400">Data de início</span>
          <span className="text-petrol">{new Date(contract.start_date).toLocaleDateString('pt-BR')}</span>
        </div>
        {contract.solana_tx_hash && (
          <div className="flex justify-between">
            <span className="text-petrol-400">Tx Solana</span>
            <span className="text-mint text-xs font-mono truncate max-w-[120px]">
              {contract.solana_tx_hash.slice(0, 8)}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

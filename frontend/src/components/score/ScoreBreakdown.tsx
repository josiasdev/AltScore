import type { ScoreBreakdown } from '../../types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

export function ScoreBreakdownComponent({ breakdown }: ScoreBreakdownProps) {
  const items = [
    { label: 'Histórico de Pagamento', value: breakdown.payment, max: 400, color: 'bg-mint' },
    { label: 'Consistência de Renda', value: breakdown.income, max: 250, color: 'bg-mint-500' },
    { label: 'Dados Open Finance', value: breakdown.finance, max: 200, color: 'bg-mint-400' },
    { label: 'Avaliação Social', value: breakdown.social, max: 150, color: 'bg-mint-300' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-petrol">Composição do Score</h3>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-petrol">{item.label}</span>
            <span className="text-petrol-400">{item.value} / {item.max}</span>
          </div>
          <div className="w-full h-2 bg-petrol-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-full`}
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

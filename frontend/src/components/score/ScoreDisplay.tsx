import { Badge } from '../ui/Badge';

interface ScoreDisplayProps {
  score: number;
  level: string;
  showDetails?: boolean;
}

export function ScoreDisplay({ score, level, showDetails = false }: ScoreDisplayProps) {
  const getColor = (s: number) => {
    if (s >= 800) return 'text-mint';
    if (s >= 600) return 'text-mint-600';
    if (s >= 400) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBadgeVariant = (l: string) => {
    if (l === 'Excelente') return 'success';
    if (l === 'Bom') return 'info';
    return 'warning';
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="relative">
        <svg width="140" height="140" className="transform -rotate-90">
          <circle cx="70" cy="70" r="60" fill="none" stroke="#E8F2F2" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke={score >= 800 ? '#2EC4B6' : score >= 600 ? '#25A396' : score >= 400 ? '#F59E0B' : '#EF4444'}
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 * (1 - score / 1000)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-heading font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-petrol-400 text-sm">/ 1000</span>
        </div>
      </div>
      <Badge variant={getBadgeVariant(level)}>{level}</Badge>
      {showDetails && (
        <p className="mt-4 text-center text-petrol-400 text-sm">
          Conecte mais fontes para aumentar seu score
        </p>
      )}
    </div>
  );
}

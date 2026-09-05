interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, size = 'md' }: ScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 800) return '#2EC4B6';
    if (s >= 600) return '#25A396';
    if (s >= 400) return '#F59E0B';
    return '#EF4444';
  };

  const sizes = {
    sm: { width: 80, height: 80, textSize: 'text-lg', labelSize: 'text-xs' },
    md: { width: 120, height: 120, textSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { width: 160, height: 160, textSize: 'text-4xl', labelSize: 'text-base' },
  };

  const { width, height, textSize, labelSize } = sizes[size];
  const radius = (width - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 1000) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="transform -rotate-90">
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="#E8F2F2"
          strokeWidth="8"
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width, height }}>
        <span className={`font-heading font-bold ${textSize}`} style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className={`text-petrol-400 ${labelSize}`}>/ 1000</span>
      </div>
    </div>
  );
}

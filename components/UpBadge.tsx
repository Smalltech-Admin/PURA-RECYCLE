export function UpBadge({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const points: string[] = [];
  const cx = 50, cy = 50, outerR = 48, innerR = 33, spikes = 24;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  const sizeClass = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
  const fontSize = size === 'lg' ? '24' : '22';

  return (
    <div className={`absolute bottom-2 right-2 ${sizeClass}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon
          points={points.join(' ')}
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="2"
        />
        <text
          x="50"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FF0000"
          fontSize={fontSize}
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          stroke="#CC0000"
          strokeWidth="0.5"
        >
          価格
        </text>
        <text
          x="50"
          y="63"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FF0000"
          fontSize={fontSize}
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          stroke="#CC0000"
          strokeWidth="0.5"
        >
          UP!
        </text>
      </svg>
    </div>
  );
}

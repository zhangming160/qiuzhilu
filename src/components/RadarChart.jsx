import { COLORS } from '../constants/colors';

const RadarChart = ({ size = 250 }) => {
  const categories = [
    'AI',
    '\u9500\u552e',
    '\u8fd0\u8425',
    '\u7b56\u5212',
    '\u6c9f\u901a',
    '\u6280\u672f'
  ];
  const values = [80, 75, 60, 45, 90, 55];
  const center = size / 2;
  const radius = size * 0.4;

  const points = categories
    .map((_, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      const x = center + radius * (values[i] / 100) * Math.cos(angle);
      const y = center + radius * (values[i] / 100) * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1].map(level =>
    categories
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
        return `${center + radius * level * Math.cos(angle)},${center + radius * level * Math.sin(angle)}`;
      })
      .join(' ')
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '4px 16px',
          borderRadius: '12px',
          border: '2px solid #724412',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {'\u80fd\u529b\u503e\u5411\u96f7\u8fbe\u56fe'}
      </div>
      <svg width={size} height={size}>
        {gridLevels.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#E3CB8F" strokeWidth="1" />
        ))}
        {categories.map((_, i) => {
          const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#E3CB8F"
              strokeWidth="1"
            />
          );
        })}
        <polygon points={points} fill={`${COLORS.primary}33`} stroke={COLORS.primary} strokeWidth="3" />
        {categories.map((cat, i) => {
          const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill={COLORS.text}
            >
              {cat}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;

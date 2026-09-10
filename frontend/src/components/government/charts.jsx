function polarToCartesian(cx, cy, radius, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function DonutChart({ segments, size = 168, thickness = 18 }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = size / 2 - 8;
  let cursor = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Status distribution">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(115,119,127,0.16)" strokeWidth={thickness} />
      {segments.map((segment) => {
        const angle = (segment.value / total) * 360;
        const start = cursor;
        const end = cursor + angle;
        cursor = end;
        return (
          <path
            key={segment.label}
            d={arcPath(size / 2, size / 2, radius, start, end - 0.6)}
            fill="none"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
          />
        );
      })}
      <text x="50%" y="48%" textAnchor="middle" className="gov-chart-center-value">
        {total}
      </text>
      <text x="50%" y="61%" textAnchor="middle" className="gov-chart-center-label">
        Projects
      </text>
    </svg>
  );
}

export function HorizontalBars({ items, max }) {
  const ceiling = max || Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="gov-hbar-list" role="img" aria-label="Risk factor contribution">
      {items.map((item) => (
        <div key={item.label} className="gov-hbar-row">
          <span className="gov-hbar-label">{item.label}</span>
          <div className="gov-hbar-track" aria-hidden="true">
            <span style={{ width: `${Math.round((item.value / ceiling) * 100)}%` }} />
          </div>
          <span className="gov-hbar-value">+{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LineBarChart({ series, expectedKey = 'expected', actualKey = 'actual' }) {
  const width = 560;
  const height = 220;
  const pad = { top: 16, right: 12, bottom: 32, left: 32 };
  const values = series.flatMap((row) => [row[expectedKey], row[actualKey]]);
  const max = Math.max(...values, 1);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const gap = innerW / series.length;
  const barW = Math.max(10, gap * 0.28);

  const y = (value) => pad.top + innerH - (value / max) * innerH;
  const points = series
    .map((row, index) => {
      const x = pad.left + gap * index + gap / 2;
      return `${x},${y(row[expectedKey])}`;
    })
    .join(' ');

  return (
    <svg className="gov-linebar" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Expected versus actual completion">
      {[0.25, 0.5, 0.75, 1].map((tick) => (
        <line
          key={tick}
          x1={pad.left}
          x2={width - pad.right}
          y1={y(max * tick)}
          y2={y(max * tick)}
          stroke="rgba(115,119,127,0.18)"
        />
      ))}
      {series.map((row, index) => {
        const x = pad.left + gap * index + gap / 2 - barW / 2;
        const h = (row[actualKey] / max) * innerH;
        return (
          <rect
            key={row.month}
            x={x}
            y={y(row[actualKey])}
            width={barW}
            height={h}
            fill="#123b5d"
            opacity="0.88"
          />
        );
      })}
      <polyline fill="none" stroke="#c5673a" strokeWidth="2" points={points} />
      {series.map((row, index) => {
        const x = pad.left + gap * index + gap / 2;
        return (
          <g key={`${row.month}-mark`}>
            <circle cx={x} cy={y(row[expectedKey])} r="3" fill="#c5673a" />
            <text x={x} y={height - 10} textAnchor="middle" className="gov-chart-tick">
              {row.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function StackedBudget({ data }) {
  const total = data.allocated || 1;
  const parts = [
    { key: 'Released', value: data.released, color: '#123b5d' },
    { key: 'Spent', value: data.spent, color: '#3d6185' },
    { key: 'Remaining', value: data.remaining, color: '#c2c7cf' },
  ];

  return (
    <div className="gov-budget-viz">
      <div className="gov-budget-track" aria-hidden="true">
        {parts.map((part) => (
          <span key={part.key} style={{ width: `${(part.value / total) * 100}%`, background: part.color }} />
        ))}
      </div>
      <dl className="gov-budget-legend">
        <div>
          <dt>Allocated</dt>
          <dd>₹{data.allocated} Cr</dd>
        </div>
        {parts.map((part) => (
          <div key={part.key}>
            <dt>
              <i style={{ background: part.color }} />
              {part.key}
            </dt>
            <dd>₹{part.value} Cr</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

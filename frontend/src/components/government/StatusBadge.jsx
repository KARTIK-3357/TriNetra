function StatusBadge({ value, kind }) {
  const tone = kind || String(value || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`gov-badge ${tone}`}>{value}</span>;
}

export default StatusBadge;

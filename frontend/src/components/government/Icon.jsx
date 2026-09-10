function Icon({ name, className = '', filled = false }) {
  return (
    <span
      className={`material-symbols gov-icon ${className}`.trim()}
      aria-hidden="true"
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  );
}

export default Icon;

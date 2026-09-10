import { useCitizenTheme } from '../../context/CitizenThemeContext';

function CitizenThemeToggle() {
  const { theme, toggleTheme } = useCitizenTheme();

  return (
    <button
      type="button"
      className="citizen-theme-toggle"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}

export default CitizenThemeToggle;

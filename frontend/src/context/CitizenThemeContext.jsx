import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CitizenThemeContext = createContext();

export function CitizenThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('trinetra-citizen-theme');
      return savedTheme || 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.style.background = theme === 'dark' ? '#0b1220' : '#f7f9ff';
    document.body.style.color = theme === 'dark' ? '#edf4ff' : '#121c26';
    try {
      localStorage.setItem('trinetra-citizen-theme', theme);
    } catch (error) {
      // ignored in restricted browser environments
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <CitizenThemeContext.Provider value={value}>{children}</CitizenThemeContext.Provider>;
}

export function useCitizenTheme() {
  const context = useContext(CitizenThemeContext);

  if (!context) {
    throw new Error('useCitizenTheme must be used within a CitizenThemeProvider');
  }

  return context;
}

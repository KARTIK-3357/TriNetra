import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as authenticate } from '../services/authService';

const AuthContext = createContext(null);

const REMEMBER_KEY = 'trinetra.auth.remember';

function readStoredSession() {
  try {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (!remembered) return { user: null, token: null };
    const parsed = JSON.parse(remembered);
    if (!parsed?.user?.role) return { user: null, token: null };
    return { user: parsed.user, token: parsed.access_token || null };
  } catch {
    return { user: null, token: null };
  }
}

function persistSession(payload, remember) {
  const serialized = JSON.stringify({
    user: payload.user,
    access_token: payload.access_token,
  });
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, serialized);
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredSession();
    setUser(stored.user);
    setToken(stored.token);
    setReady(true);
  }, []);

  const login = useCallback(async (identifier, password, remember = false) => {
    const result = await authenticate(identifier, password);
    if (result.ok) {
      setUser(result.user);
      setToken(result.access_token);
      persistSession(result, remember);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(user?.role),
      login,
      logout,
      setUser,
    }),
    [user, token, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

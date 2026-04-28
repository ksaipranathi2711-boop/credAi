import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, setSession, clearSession, localLogin, localRegister, getLocalHistory } from '../utils/storage';
import { apiLogin, apiRegister } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { name, email, token? }
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ───────────────────────────────
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      setHistory(getLocalHistory(session.email));
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    let name, token;
    try {
      const data = await apiLogin(email, password);
      name  = data.name;
      token = data.token;
    } catch {
      // local fallback
      const data = await localLogin(email, password);
      name = data.name;
    }
    const session = { email, name, ...(token ? { token } : {}) };
    setSession(session);
    setUser(session);
    setHistory(getLocalHistory(email));
  }, []);

  // ── Register ───────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    let token;
    try {
      const data = await apiRegister(name, email, password);
      token = data.token;
    } catch (apiErr) {
      if (apiErr.message === 'Account already exists') throw apiErr;
      // local fallback
      await localRegister(name, email, password);
    }
    const session = { email, name, ...(token ? { token } : {}) };
    setSession(session);
    setUser(session);
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setHistory([]);
  }, []);

  // ── Refresh history ────────────────────────────────────────
  const refreshHistory = useCallback((email) => {
    setHistory(getLocalHistory(email));
  }, []);

  return (
    <AuthContext.Provider value={{ user, history, loading, login, register, logout, refreshHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

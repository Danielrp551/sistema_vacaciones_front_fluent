import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../services/auth.service';
import type { AuthResponse } from '../services/auth.service';

export interface AuthUser {
  userName?: string;
  roles?: string[];
}

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);

  // Si ya tienes un endpoint /account/me podrías cargar el usuario aquí:
  useEffect(() => {
    if (!token) {
      setUser(null);
    } else {
      // Opcional: decodificar JWT o pedir /me
      // const decoded = parseJwt(token); setUser({ userName: decoded.unique_name, roles: decoded.role ? [decoded.role] : [] });
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const res: AuthResponse = await AuthService.login({ username, password });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser({ userName: res.userName, roles: res.roles });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Opcional: AuthService.logout();
  };

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token,
    token,
    user,
    login,
    logout,
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

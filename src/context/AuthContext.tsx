import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../services/auth.service';
import type { AuthResponse } from '../services/auth.service';

export interface AuthUser {
  userName?: string;
  email?: string;
  roles?: string[];
  permisos?: string[];
  persona?: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    dni: string;
    telefono: string;
    fechaIngreso: string;
  };
}

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredPermissions: string[]) => boolean;
  hasAllPermissions: (requiredPermissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar datos del usuario si hay token pero no hay datos de usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          const currentUser = await AuthService.getCurrentUser();
          setUser({
            userName: currentUser.userName,
            email: currentUser.email,
            roles: currentUser.roles,
            permisos: currentUser.permisos,
            persona: {
              nombres: currentUser.persona.nombres,
              apellidoPaterno: currentUser.persona.apellidoPaterno,
              apellidoMaterno: currentUser.persona.apellidoMaterno,
              dni: currentUser.persona.dni,
              telefono: currentUser.persona.telefono,
              fechaIngreso: currentUser.persona.fechaIngreso,
            }
          });
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          // Si el token es inválido, limpiar la sesión
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else if (!token) {
        setUser(null);
      }
    };

    loadUserData();
  }, [token, user]);

  const login = async (username: string, password: string) => {
    const res: AuthResponse = await AuthService.login({ username, password });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    
    // Obtener información completa del usuario después del login
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser({
        userName: currentUser.userName,
        email: currentUser.email,
        roles: currentUser.roles,
        permisos: currentUser.permisos,
        persona: {
          nombres: currentUser.persona.nombres,
          apellidoPaterno: currentUser.persona.apellidoPaterno,
          apellidoMaterno: currentUser.persona.apellidoMaterno,
          dni: currentUser.persona.dni,
          telefono: currentUser.persona.telefono,
          fechaIngreso: currentUser.persona.fechaIngreso,
        }
      });
    } catch (error) {
      // Fallback si no se pueden obtener los datos completos
      setUser({ 
        userName: res.userName, 
        roles: res.roles,
        permisos: res.permisos || []
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Opcional: AuthService.logout();
  };

  // Funciones de validación de permisos
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!user?.permisos) return false;
    return requiredPermissions.some(permission => user.permisos!.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!user?.permisos) return false;
    return requiredPermissions.every(permission => user.permisos!.includes(permission));
  };

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token,
    token,
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasAllPermissions,
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

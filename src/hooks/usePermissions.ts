// ============================================================================
// HOOK PARA GESTIÓN DE PERMISOS
// ============================================================================
// Hook personalizado que encapsula la lógica de validación de permisos
// basado en los códigos de permiso del usuario autenticado
// ============================================================================

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para gestión y validación de permisos del usuario
 * Proporciona métodos para verificar si el usuario tiene permisos específicos
 */
export const usePermissions = () => {
  const { user, hasPermission: contextHasPermission, hasAllPermissions: contextHasAllPermissions } = useAuth();

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados (lógica OR)
   * @param requiredPermissions - Array de códigos de permiso requeridos
   * @returns true si el usuario tiene al menos uno de los permisos
   */
  const hasPermission = useCallback((requiredPermissions: string[]): boolean => {
    return contextHasPermission(requiredPermissions);
  }, [contextHasPermission]);

  /**
   * Verifica si el usuario tiene todos los permisos especificados (lógica AND)
   * @param requiredPermissions - Array de códigos de permiso requeridos
   * @returns true si el usuario tiene todos los permisos
   */
  const hasAllPermissions = useCallback((requiredPermissions: string[]): boolean => {
    return contextHasAllPermissions(requiredPermissions);
  }, [contextHasAllPermissions]);

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Código de permiso específico
   * @returns true si el usuario tiene el permiso
   */
  const hasSpecificPermission = useCallback((permission: string): boolean => {
    return hasPermission([permission]);
  }, [hasPermission]);

  /**
   * Obtiene la lista completa de permisos del usuario
   * @returns Array de códigos de permiso del usuario
   */
  const getUserPermissions = useCallback((): string[] => {
    return user?.permisos || [];
  }, [user?.permisos]);

  /**
   * Verifica si el usuario está autenticado y tiene permisos
   * @returns true si el usuario está autenticado y tiene permisos
   */
  const hasAnyPermission = useCallback((): boolean => {
    return (user?.permisos?.length || 0) > 0;
  }, [user?.permisos]);

  return {
    hasPermission,
    hasAllPermissions,
    hasSpecificPermission,
    getUserPermissions,
    hasAnyPermission,
    userPermissions: user?.permisos || []
  };
};

/**
 * Tipos para facilitar el uso del hook
 */
export type UsePermissionsReturn = ReturnType<typeof usePermissions>;
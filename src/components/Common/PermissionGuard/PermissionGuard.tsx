// ============================================================================
// COMPONENTE PERMISSION GUARD
// ============================================================================
// Componente wrapper que condiciona la renderización de elementos basado en
// los permisos del usuario autenticado
// ============================================================================

import React from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import type { PermisoCode } from '../../../types/permissions';

/**
 * Props para el componente PermissionGuard
 */
export interface PermissionGuardProps {
  /** Códigos de permiso requeridos para mostrar el contenido */
  permisos: PermisoCode[];
  /** Si se requieren TODOS los permisos (AND) o al menos UNO (OR). Default: false (OR) */
  requireAll?: boolean;
  /** Contenido a mostrar si no tiene permisos */
  fallback?: React.ReactNode;
  /** Si mostrar el fallback o simplemente ocultar el contenido. Default: false (ocultar) */
  showFallback?: boolean;
  /** Contenido a proteger */
  children: React.ReactNode;
  /** Clase CSS adicional para el wrapper (opcional) */
  className?: string;
}

/**
 * Componente que condiciona la renderización basado en permisos del usuario
 * 
 * @example
 * // Mostrar solo si tiene al menos uno de los permisos (OR logic)
 * <PermissionGuard permisos={['ADMIN-USUARIOS-VER', 'ADMIN-USUARIOS-CREAR']}>
 *   <UserButton />
 * </PermissionGuard>
 * 
 * @example
 * // Mostrar solo si tiene todos los permisos (AND logic)
 * <PermissionGuard 
 *   permisos={['ADMIN-USUARIOS-VER', 'ADMIN-USUARIOS-EDITAR']} 
 *   requireAll={true}
 * >
 *   <EditUserButton />
 * </PermissionGuard>
 * 
 * @example
 * // Con fallback personalizado
 * <PermissionGuard 
 *   permisos={['ADMIN-REPORTES-VER']}
 *   fallback={<div>No tienes permisos para ver reportes</div>}
 *   showFallback={true}
 * >
 *   <ReportsComponent />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permisos,
  requireAll = false,
  fallback = null,
  showFallback = false,
  children,
  className
}) => {
  const { hasPermission, hasAllPermissions } = usePermissions();

  // Validar permisos
  const hasAccess = requireAll 
    ? hasAllPermissions(permisos)
    : hasPermission(permisos);

  // Si no tiene acceso
  if (!hasAccess) {
    // Mostrar fallback si está configurado
    if (showFallback && fallback) {
      return <div className={className}>{fallback}</div>;
    }
    // Ocultar completamente
    return null;
  }

  // Mostrar contenido protegido
  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * Hook para usar PermissionGuard de forma programática
 * 
 * @example
 * function MyComponent() {
 *   const canAccess = usePermissionGuard(['ADMIN-USUARIOS-VER']);
 *   
 *   if (!canAccess) return null;
 *   
 *   return <UserComponent />;
 * }
 */
export const usePermissionGuard = (
  permisos: PermisoCode[], 
  requireAll: boolean = false
): boolean => {
  const { hasPermission, hasAllPermissions } = usePermissions();
  
  return requireAll 
    ? hasAllPermissions(permisos)
    : hasPermission(permisos);
};
// ============================================================================
// CONSTANTES Y TIPOS PARA SISTEMA DE PERMISOS
// ============================================================================
// Este archivo define todas las constantes de permisos del sistema y sus tipos
// para proporcionar type safety y autocomplete en toda la aplicación
// ============================================================================

/**
 * Constantes de permisos del sistema
 * Estas deben coincidir exactamente con los códigos almacenados en la base de datos
 */
export const PERMISOS = {
  // ========================================================================
  // PERMISOS DE MENÚ PRINCIPAL
  // ========================================================================
  DASHBOARD_MENU: 'DASHBOARD-MENU',
  MIS_SOLICITUDES_MENU: 'MIS-SOLICITUDES-MENU',
  SOLICITAR_VACACIONES_MENU: 'SOLICITAR-VACACIONES-MENU',
  REPORTE_EQUIPO_MENU: 'REPORTE-EQUIPO-MENU',
  GESTION_SOLICITUDES_MENU: 'GESTION-SOLICITUDES-MENU',
  SALDOS_VACACIONES_MENU: 'SALDOS-VACACIONES-MENU',
  PROGRAMACION_VACACIONES_MENU: 'PROGRAMACION-VACACIONES-MENU',
  ADMIN_MENU: 'ADMIN-MENU',

  // ========================================================================
  // GESTIÓN DE USUARIOS
  // ========================================================================
  ADMIN_USUARIOS_MENU: 'ADMIN-USUARIOS-MENU',
  ADMIN_USUARIOS_VER: 'ADMIN-USUARIOS-VER',
  ADMIN_USUARIOS_CREAR: 'ADMIN-USUARIOS-CREAR',
  ADMIN_USUARIOS_EDITAR: 'ADMIN-USUARIOS-EDITAR',
  ADMIN_USUARIOS_ELIMINAR: 'ADMIN-USUARIOS-ELIMINAR',
  ADMIN_USUARIOS_ACTIVAR: 'ADMIN-USUARIOS-ACTIVAR',
  ADMIN_USUARIOS_DESACTIVAR: 'ADMIN-USUARIOS-DESACTIVAR',
  ADMIN_USUARIOS_RESETEAR_PASSWORD: 'ADMIN-USUARIOS-RESETEAR-PASSWORD',
  ADMIN_USUARIOS_ASIGNAR_ROL: 'ADMIN-USUARIOS-ASIGNAR-ROL',
  ADMIN_USUARIOS_IMPORTAR: 'ADMIN-USUARIOS-IMPORTAR',

  // ========================================================================
  // GESTIÓN DE ROLES
  // ========================================================================
  ADMIN_ROLES_MENU: 'ADMIN-ROLES-MENU',
  ADMIN_ROLES_VER: 'ADMIN-ROLES-VER',
  ADMIN_ROLES_CREAR: 'ADMIN-ROLES-CREAR',
  ADMIN_ROLES_EDITAR: 'ADMIN-ROLES-EDITAR',
  ADMIN_ROLES_ELIMINAR: 'ADMIN-ROLES-ELIMINAR',
  ADMIN_ROLES_ASIGNAR_PERMISOS: 'ADMIN-ROLES-ASIGNAR-PERMISOS',

  // ========================================================================
  // GESTIÓN DE PERMISOS
  // ========================================================================
  ADMIN_PERMISOS_MENU: 'ADMIN-PERMISOS-MENU',
  ADMIN_PERMISOS_VER: 'ADMIN-PERMISOS-VER',
  ADMIN_PERMISOS_CREAR: 'ADMIN-PERMISOS-CREAR',
  ADMIN_PERMISOS_EDITAR: 'ADMIN-PERMISOS-EDITAR',
  ADMIN_PERMISOS_ELIMINAR: 'ADMIN-PERMISOS-ELIMINAR',

  // ========================================================================
  // SOLICITUDES DE VACACIONES
  // ========================================================================
  VACACIONES_VER_PROPIAS: 'VACACIONES-VER-PROPIAS',
  VACACIONES_SOLICITAR: 'VACACIONES-SOLICITAR',
  VACACIONES_CANCELAR_PROPIAS: 'VACACIONES-CANCELAR-PROPIAS',
  VACACIONES_VER_EQUIPO: 'VACACIONES-VER-EQUIPO',
  VACACIONES_APROBAR: 'VACACIONES-APROBAR',
  VACACIONES_RECHAZAR: 'VACACIONES-RECHAZAR',
  VACACIONES_VER_TODAS: 'VACACIONES-VER-TODAS',

  // ========================================================================
  // HISTORIAL Y SALDOS DE VACACIONES
  // ========================================================================
  HISTORIAL_VER_PROPIO: 'HISTORIAL-VER-PROPIO',
  HISTORIAL_VER_EQUIPO: 'HISTORIAL-VER-EQUIPO',
  HISTORIAL_VER_TODOS: 'HISTORIAL-VER-TODOS',
  SALDOS_VER_PROPIOS: 'SALDOS-VER-PROPIOS',
  SALDOS_VER_EQUIPO: 'SALDOS-VER-EQUIPO',
  SALDOS_VER_TODOS: 'SALDOS-VER-TODOS',
  SALDOS_AJUSTAR: 'SALDOS-AJUSTAR',

  // ========================================================================
  // REPORTES Y ANALÍTICAS
  // ========================================================================
  REPORTES_VER: 'REPORTES-VER',
  REPORTES_EXPORTAR: 'REPORTES-EXPORTAR',
  REPORTES_AVANZADOS: 'REPORTES-AVANZADOS',
  DASHBOARD_VER: 'DASHBOARD-VER',
  ANALYTICS_VER: 'ANALYTICS-VER',

  // ========================================================================
  // AUDITORÍA Y SEGURIDAD
  // ========================================================================
  AUDITORIA_VER: 'AUDITORIA-VER',
  AUDITORIA_EXPORTAR: 'AUDITORIA-EXPORTAR',
  SEGURIDAD_CONFIGURAR: 'SEGURIDAD-CONFIGURAR',

  // ========================================================================
  // CONFIGURACIÓN DEL SISTEMA
  // ========================================================================
  CONFIG_VER: 'CONFIG-VER',
  CONFIG_EDITAR: 'CONFIG-EDITAR',
  CONFIG_BACKUP: 'CONFIG-BACKUP',
  CONFIG_RESTORE: 'CONFIG-RESTORE',

} as const;

/**
 * Tipo que representa cualquier código de permiso válido
 */
export type PermisoCode = typeof PERMISOS[keyof typeof PERMISOS];

/**
 * Grupos de permisos para facilitar la gestión
 */
export const GRUPOS_PERMISOS = {
  // Administración de usuarios
  ADMIN_USUARIOS: [
    PERMISOS.ADMIN_USUARIOS_MENU,
    PERMISOS.ADMIN_USUARIOS_VER,
    PERMISOS.ADMIN_USUARIOS_CREAR,
    PERMISOS.ADMIN_USUARIOS_EDITAR,
    PERMISOS.ADMIN_USUARIOS_ELIMINAR,
    PERMISOS.ADMIN_USUARIOS_ACTIVAR,
    PERMISOS.ADMIN_USUARIOS_DESACTIVAR,
    PERMISOS.ADMIN_USUARIOS_RESETEAR_PASSWORD,
    PERMISOS.ADMIN_USUARIOS_ASIGNAR_ROL,
    PERMISOS.ADMIN_USUARIOS_IMPORTAR,
  ],

  // Administración de roles
  ADMIN_ROLES: [
    PERMISOS.ADMIN_ROLES_MENU,
    PERMISOS.ADMIN_ROLES_VER,
    PERMISOS.ADMIN_ROLES_CREAR,
    PERMISOS.ADMIN_ROLES_EDITAR,
    PERMISOS.ADMIN_ROLES_ELIMINAR,
    PERMISOS.ADMIN_ROLES_ASIGNAR_PERMISOS,
  ],

  // Administración de permisos
  ADMIN_PERMISOS: [
    PERMISOS.ADMIN_PERMISOS_MENU,
    PERMISOS.ADMIN_PERMISOS_VER,
    PERMISOS.ADMIN_PERMISOS_CREAR,
    PERMISOS.ADMIN_PERMISOS_EDITAR,
    PERMISOS.ADMIN_PERMISOS_ELIMINAR,
  ],

  // Gestión de vacaciones básica
  VACACIONES_EMPLEADO: [
    PERMISOS.VACACIONES_VER_PROPIAS,
    PERMISOS.VACACIONES_SOLICITAR,
    PERMISOS.VACACIONES_CANCELAR_PROPIAS,
    PERMISOS.HISTORIAL_VER_PROPIO,
    PERMISOS.SALDOS_VER_PROPIOS,
  ],

  // Gestión de vacaciones supervisor
  VACACIONES_SUPERVISOR: [
    PERMISOS.VACACIONES_VER_EQUIPO,
    PERMISOS.VACACIONES_APROBAR,
    PERMISOS.VACACIONES_RECHAZAR,
    PERMISOS.HISTORIAL_VER_EQUIPO,
    PERMISOS.SALDOS_VER_EQUIPO,
  ],

  // Gestión de vacaciones administrador
  VACACIONES_ADMIN: [
    PERMISOS.VACACIONES_VER_TODAS,
    PERMISOS.HISTORIAL_VER_TODOS,
    PERMISOS.SALDOS_VER_TODOS,
    PERMISOS.SALDOS_AJUSTAR,
  ],

  // Reportes y análisis
  REPORTES: [
    PERMISOS.REPORTES_VER,
    PERMISOS.REPORTES_EXPORTAR,
    PERMISOS.REPORTES_AVANZADOS,
    PERMISOS.DASHBOARD_VER,
    PERMISOS.ANALYTICS_VER,
  ],

  // Administración del sistema
  ADMIN_SISTEMA: [
    PERMISOS.AUDITORIA_VER,
    PERMISOS.AUDITORIA_EXPORTAR,
    PERMISOS.SEGURIDAD_CONFIGURAR,
    PERMISOS.CONFIG_VER,
    PERMISOS.CONFIG_EDITAR,
    PERMISOS.CONFIG_BACKUP,
    PERMISOS.CONFIG_RESTORE,
  ],
} as const;

/**
 * Interfaz para propiedades de componentes que requieren permisos
 */
export interface WithPermissionProps {
  permisos?: PermisoCode[];
  requireAll?: boolean;
}

/**
 * Interfaz para configuración de validación de permisos
 */
export interface PermissionConfig {
  permisos: PermisoCode[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Tipo para funciones de validación de permisos
 */
export type PermissionValidator = (permissions: PermisoCode[]) => boolean;

/**
 * Utilidades para trabajar con permisos
 */
export const PermissionUtils = {
  /**
   * Verifica si un código es un permiso válido
   */
  isValidPermission: (code: string): code is PermisoCode => {
    return Object.values(PERMISOS).includes(code as PermisoCode);
  },

  /**
   * Obtiene todos los permisos de un grupo
   */
  getPermissionsFromGroup: (groupName: keyof typeof GRUPOS_PERMISOS): readonly PermisoCode[] => {
    return GRUPOS_PERMISOS[groupName];
  },

  /**
   * Formatea un código de permiso para mostrar
   */
  formatPermissionCode: (code: PermisoCode): string => {
    return code.replace(/-/g, ' ').toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  },
};
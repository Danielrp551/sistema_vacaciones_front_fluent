import { TipoAccionAuditoria, ModuloSistema, SeveridadAuditoria } from '../types/auditoria';

// ============================================================================
// CONSTANTES Y UTILIDADES PARA AUDITORÍA
// ============================================================================

/**
 * Mapeo de acciones de auditoría a descripciones legibles
 */
export const DESCRIPCIONES_ACCIONES = {
  // Gestión de Usuarios
  [TipoAccionAuditoria.CREAR_USUARIO]: 'Crear Usuario',
  [TipoAccionAuditoria.EDITAR_USUARIO]: 'Editar Usuario',
  [TipoAccionAuditoria.ELIMINAR_USUARIO]: 'Eliminar Usuario',
  [TipoAccionAuditoria.ACTIVAR_USUARIO]: 'Activar Usuario',
  [TipoAccionAuditoria.DESACTIVAR_USUARIO]: 'Desactivar Usuario',
  [TipoAccionAuditoria.RESETEAR_PASSWORD]: 'Reiniciar Contraseña',
  [TipoAccionAuditoria.CAMBIAR_PASSWORD]: 'Cambiar Contraseña',
  [TipoAccionAuditoria.ASIGNAR_ROL]: 'Asignar Rol',
  [TipoAccionAuditoria.REMOVER_ROL]: 'Remover Rol',
  [TipoAccionAuditoria.ASIGNAR_JEFE]: 'Asignar Jefe',
  [TipoAccionAuditoria.REMOVER_JEFE]: 'Remover Jefe',
  
  // Autenticación
  [TipoAccionAuditoria.LOGIN_EXITOSO]: 'Inicio de Sesión Exitoso',
  [TipoAccionAuditoria.LOGIN_FALLIDO]: 'Intento de Inicio de Sesión Fallido',
  [TipoAccionAuditoria.LOGOUT]: 'Cerrar Sesión',
  [TipoAccionAuditoria.SESION_EXPIRADA]: 'Sesión Expirada',
  
  // Solicitudes de Vacaciones
  [TipoAccionAuditoria.CREAR_SOLICITUD]: 'Crear Solicitud de Vacaciones',
  [TipoAccionAuditoria.APROBAR_SOLICITUD]: 'Aprobar Solicitud',
  [TipoAccionAuditoria.RECHAZAR_SOLICITUD]: 'Rechazar Solicitud',
  [TipoAccionAuditoria.CANCELAR_SOLICITUD]: 'Cancelar Solicitud',
  
  // Gestión de Saldos
  [TipoAccionAuditoria.AJUSTAR_SALDO]: 'Ajustar Saldo de Vacaciones',
  [TipoAccionAuditoria.PROCESAR_VACACIONES]: 'Procesar Vacaciones',
  
  // Configuración del Sistema
  [TipoAccionAuditoria.CAMBIAR_CONFIGURACION]: 'Cambiar Configuración',
  [TipoAccionAuditoria.BACKUP_SISTEMA]: 'Respaldar Sistema',
  [TipoAccionAuditoria.RESTAURAR_SISTEMA]: 'Restaurar Sistema'
} as const;

/**
 * Mapeo de módulos a descripciones legibles
 */
export const DESCRIPCIONES_MODULOS = {
  [ModuloSistema.AUTENTICACION]: 'Autenticación',
  [ModuloSistema.GESTION_USUARIOS]: 'Gestión de Usuarios',
  [ModuloSistema.SOLICITUDES_VACACIONES]: 'Solicitudes de Vacaciones',
  [ModuloSistema.HISTORIAL_VACACIONES]: 'Historial de Vacaciones',
  [ModuloSistema.SALDOS_VACACIONES]: 'Saldos de Vacaciones',
  [ModuloSistema.CONFIGURACION]: 'Configuración',
  [ModuloSistema.AUDITORIA]: 'Auditoría',
  [ModuloSistema.REPORTES]: 'Reportes',
  [ModuloSistema.ADMINISTRACION]: 'Administración',
  [ModuloSistema.SISTEMA]: 'Sistema'
} as const;

/**
 * Mapeo de severidades a descripciones y colores
 */
export const SEVERIDAD_CONFIG = {
  [SeveridadAuditoria.INFO]: {
    descripcion: 'Información',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  [SeveridadAuditoria.WARNING]: {
    descripcion: 'Advertencia',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  [SeveridadAuditoria.ERROR]: {
    descripcion: 'Error',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  [SeveridadAuditoria.SECURITY]: {
    descripcion: 'Seguridad',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  [SeveridadAuditoria.CRITICAL]: {
    descripcion: 'Crítico',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300'
  }
} as const;

/**
 * Opciones para filtros de severidad
 */
export const OPCIONES_SEVERIDAD = Object.entries(SEVERIDAD_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.descripcion,
  color: config.color
}));

/**
 * Opciones para filtros de módulos
 */
export const OPCIONES_MODULOS = Object.entries(DESCRIPCIONES_MODULOS).map(([key, descripcion]) => ({
  value: key,
  label: descripcion
}));

/**
 * Opciones para filtros de acciones específicas de gestión de usuarios
 */
export const ACCIONES_GESTION_USUARIOS = [
  TipoAccionAuditoria.CREAR_USUARIO,
  TipoAccionAuditoria.EDITAR_USUARIO,
  TipoAccionAuditoria.ELIMINAR_USUARIO,
  TipoAccionAuditoria.ACTIVAR_USUARIO,
  TipoAccionAuditoria.DESACTIVAR_USUARIO,
  TipoAccionAuditoria.RESETEAR_PASSWORD,
  TipoAccionAuditoria.ASIGNAR_ROL,
  TipoAccionAuditoria.REMOVER_ROL,
  TipoAccionAuditoria.ASIGNAR_JEFE,
  TipoAccionAuditoria.REMOVER_JEFE
];

/**
 * Opciones para filtros de acciones de gestión de usuarios
 */
export const OPCIONES_ACCIONES_USUARIOS = ACCIONES_GESTION_USUARIOS.map(accion => ({
  value: accion,
  label: DESCRIPCIONES_ACCIONES[accion]
}));

/**
 * Configuración de paginación por defecto
 */
export const PAGINACION_DEFAULT = {
  PAGINA_INICIAL: 1,
  TAMANO_PAGINA_DEFAULT: 10,
  TAMANO_PAGINA_MAXIMO: 50,
  OPCIONES_TAMANO_PAGINA: [5, 10, 15, 25, 50]
} as const;

/**
 * Periodos predefinidos para filtros de fecha
 */
export const PERIODOS_FECHA = {
  HOY: {
    label: 'Hoy',
    dias: 0
  },
  ULTIMA_SEMANA: {
    label: 'Última semana',
    dias: 7
  },
  ULTIMO_MES: {
    label: 'Último mes',
    dias: 30
  },
  ULTIMOS_3_MESES: {
    label: 'Últimos 3 meses',
    dias: 90
  },
  ULTIMO_ANNO: {
    label: 'Último año',
    dias: 365
  }
} as const;

/**
 * Obtiene las fechas para un periodo predefinido
 */
export function obtenerFechasPeriodo(periodo: keyof typeof PERIODOS_FECHA): { desde: Date; hasta: Date } {
  const config = PERIODOS_FECHA[periodo];
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(hasta.getDate() - config.dias);
  
  return { desde, hasta };
}

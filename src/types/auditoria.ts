// ============================================================================
// TIPOS Y INTERFACES PARA AUDITORÍA
// ============================================================================
// Estos tipos corresponden exactamente a los enums y DTOs del backend
// Mantener sincronizados con el backend en sistema_vacaciones_back/Models/Enums/
// ============================================================================

// Constantes que coinciden con el backend
export const TipoAccionAuditoria = {
  // Gestión de Usuarios
  CREAR_USUARIO: 'CREAR_USUARIO',
  EDITAR_USUARIO: 'EDITAR_USUARIO',
  ELIMINAR_USUARIO: 'ELIMINAR_USUARIO',
  ACTIVAR_USUARIO: 'ACTIVAR_USUARIO',
  DESACTIVAR_USUARIO: 'DESACTIVAR_USUARIO',
  RESETEAR_PASSWORD: 'RESETEAR_PASSWORD',
  CAMBIAR_PASSWORD: 'CAMBIAR_PASSWORD',
  ASIGNAR_ROL: 'ASIGNAR_ROL',
  REMOVER_ROL: 'REMOVER_ROL',
  ASIGNAR_JEFE: 'ASIGNAR_JEFE',
  REMOVER_JEFE: 'REMOVER_JEFE',
  
  // Autenticación
  LOGIN_EXITOSO: 'LOGIN_EXITOSO',
  LOGIN_FALLIDO: 'LOGIN_FALLIDO',
  LOGOUT: 'LOGOUT',
  SESION_EXPIRADA: 'SESION_EXPIRADA',
  
  // Solicitudes de Vacaciones
  CREAR_SOLICITUD: 'CREAR_SOLICITUD',
  APROBAR_SOLICITUD: 'APROBAR_SOLICITUD',
  RECHAZAR_SOLICITUD: 'RECHAZAR_SOLICITUD',
  CANCELAR_SOLICITUD: 'CANCELAR_SOLICITUD',
  
  // Gestión de Saldos
  AJUSTAR_SALDO: 'AJUSTAR_SALDO',
  PROCESAR_VACACIONES: 'PROCESAR_VACACIONES',
  
  // Configuración del Sistema
  CAMBIAR_CONFIGURACION: 'CAMBIAR_CONFIGURACION',
  BACKUP_SISTEMA: 'BACKUP_SISTEMA',
  RESTAURAR_SISTEMA: 'RESTAURAR_SISTEMA'
} as const;

export const ModuloSistema = {
  AUTENTICACION: 'AUTENTICACION',
  GESTION_USUARIOS: 'GESTION_USUARIOS',
  SOLICITUDES_VACACIONES: 'SOLICITUDES_VACACIONES',
  HISTORIAL_VACACIONES: 'HISTORIAL_VACACIONES',
  SALDOS_VACACIONES: 'SALDOS_VACACIONES',
  CONFIGURACION: 'CONFIGURACION',
  AUDITORIA: 'AUDITORIA',
  REPORTES: 'REPORTES',
  ADMINISTRACION: 'ADMINISTRACION',
  SISTEMA: 'SISTEMA'
} as const;

export const SeveridadAuditoria = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY',
  CRITICAL: 'CRITICAL'
} as const;

// Tipos derivados
export type TipoAccionAuditoriaType = typeof TipoAccionAuditoria[keyof typeof TipoAccionAuditoria];
export type ModuloSistemaType = typeof ModuloSistema[keyof typeof ModuloSistema];
export type SeveridadAuditoriaType = typeof SeveridadAuditoria[keyof typeof SeveridadAuditoria];

// Interfaces principales
export interface AuditoriaSimple {
  id: string;
  accion: string;
  usuarioEjecutor: string;
  usuarioAfectado?: string;
  mensajeCorto: string;
  motivo?: string;
  fechaHora: string; // ISO string
  severidad: string;
  ipAddress: string;
}

export interface AuditoriaCompleta extends AuditoriaSimple {
  tipoAccion: TipoAccionAuditoriaType;
  modulo: ModuloSistemaType;
  tablaAfectada?: string;
  registroAfectadoId?: string;
  usuarioEjecutorId: string;
  usuarioEjecutorEmail?: string;
  usuarioAfectadoId?: string;
  usuarioAfectadoEmail?: string;
  mensajeDetallado: string;
  mensajePlantilla: string;
  observaciones?: string;
  userAgent?: string;
  sessionId?: string;
  tags?: string;
  tiempoEjecucionMs?: number;
  esVisible: boolean;
}

// Respuestas paginadas
export interface AuditoriaSimplePaginada {
  registros: AuditoriaSimple[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export interface AuditoriaCompletaPaginada {
  registros: AuditoriaCompleta[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  tamanoPagina: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

// Filtros para consultas
export interface FiltrosAuditoria {
  pagina?: number;
  tamanoPagina?: number;
  usuarioId?: string;
  tipoAccion?: TipoAccionAuditoriaType;
  fechaDesde?: Date;
  fechaHasta?: Date;
  modulo?: ModuloSistemaType;
  severidad?: SeveridadAuditoriaType;
  ordenarPor?: 'fechaHora' | 'tipoAccion' | 'modulo' | 'usuarioEjecutor';
  ordenDescendente?: boolean;
}

// Estadísticas
export interface EstadisticasAuditoria {
  totalAcciones: number;
  accionesHoy: number;
  accionesSemana: number;
  accionesMes: number;
  accionesPorTipo: Record<string, number>;
  accionesPorModulo: Record<string, number>;
  accionesPorSeveridad: Record<string, number>;
  ultimasAccionesCriticas: AuditoriaCompleta[];
}

// Estados del hook de auditoría
export interface EstadoAuditoria {
  registros: AuditoriaSimple[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosAuditoria;
}

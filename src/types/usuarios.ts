// ============================================================================
// TIPOS TYPESCRIPT PARA GESTIÓN DE USUARIOS
// ============================================================================
// Estos tipos corresponden exactamente a los DTOs del backend
// Mantener sincronizados con el backend en sistema_vacaciones_back/DTOs/Usuarios/
// ============================================================================

// ===== TIPOS BÁSICOS =====

export interface UsuarioSimple {
  id: string;
  nombreCompleto: string;
  email: string;
}

export interface DepartamentoSimple {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  estaActivo: boolean;
  activo: boolean;
  nombreJefe?: string;
}

export interface RolSimple {
  id: string;
  name: string;
  descripcion?: string;
  activo: boolean;
}

// ===== USUARIO PARA ADMINISTRACIÓN =====

export interface UsuarioAdmin {
  id: string;
  email: string;
  nombreCompleto: string;
  nombres: string;
  apellidos: string;
  dni: string;
  roles: string[];
  rol: string; // Rol principal
  fechaIngreso: string; // ISO date string
  empresa: string;
  departamento?: string;
  extranjero: boolean;
  manager?: string;
  numeroSubordinados: number;
  estado: string; // "Activo" | "Inactivo"
  jefeId?: string;
  departamentoId?: string;
  fechaCreacion: string; // ISO date string
  fechaActualizacion?: string; // ISO date string
}

export interface UsuarioDetalle {
  id: string;
  email: string;
  
  // Información personal
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellidos: string; // Campo combinado para facilidad de uso
  dni: string;
  telefono?: string;
  fechaNacimiento?: string;
  extranjero: boolean;
  fechaIngreso: string;
  empresa: string;
  
  // Información organizacional
  departamento?: DepartamentoSimple;
  departamentoId?: string;
  jefe?: UsuarioSimple;
  jefeId?: string;
  
  // Roles y permisos
  roles: string[];
  rol: string; // Rol principal
  
  // Estadísticas
  numeroSubordinados: number;
  
  // Auditoría
  fechaCreacion: string;
  fechaActualizacion?: string;
  creadoPor: string;
  actualizadoPor?: string;
  
  // Estado
  estaActivo: boolean;
}

// ===== DTOs PARA OPERACIONES =====

export interface CreateUsuarioDto {
  // Información personal obligatoria
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  telefono?: string;
  fechaNacimiento?: string;
  extranjero: boolean;
  fechaIngreso: string;
  
  // Información de cuenta
  email: string;
  
  // Información organizacional
  departamentoId: string;
  jefeId?: string;
  rol: string;
}

export interface UpdateUsuarioDto {
  // Información personal
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  telefono?: string;
  fechaNacimiento?: string;
  extranjero: boolean;
  fechaIngreso: string;
  
  // Información de cuenta
  email: string;
  
  // Información organizacional
  departamentoId: string;
  jefeId?: string;
  rol: string;
  estaActivo: boolean;
}

export interface ResetPasswordDto {
  usuarioId: string;
  motivo?: string;
}

export interface ResetPasswordResponse {
  exitoso: boolean;
  mensaje: string;
  nuevaPassword?: string;
  emailUsuario?: string;
}

// ===== FILTROS Y CONSULTAS =====

export interface UsuariosAdminQueryObject {
  // Paginación
  pageNumber: number;
  pageSize: number;
  
  // Filtros de búsqueda
  busquedaGeneral?: string;
  email?: string;
  departamentoId?: string;
  rol?: string;
  estaActivo?: boolean;
  extranjero?: boolean;
  
  // Filtros de fecha
  fechaIngresoDesde?: string;
  fechaIngresoHasta?: string;
  
  // Ordenamiento
  sortBy?: string;
  isDescending: boolean;
}

export interface UsuariosAdminFiltrosAplicados {
  busquedaGeneral?: string;
  email?: string;
  departamentoId?: string;
  rol?: string;
  estaActivo?: boolean;
  extranjero?: boolean;
  fechaIngresoDesde?: string;
  fechaIngresoHasta?: string;
  sortBy?: string;
  isDescending: boolean;
}

// ===== RESPUESTAS Y METADATOS =====

export interface UsuariosEstadisticas {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  usuariosForzarCambio: number;
  usuariosExtranjeros: number;
}

export interface UsuariosAdminResponse {
  usuarios: UsuarioAdmin[];
  total: number;
  totalCompleto: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
  filtrosAplicados: UsuariosAdminFiltrosAplicados;
  estadisticas: UsuariosEstadisticas;
}

// ===== RESPUESTAS DE API =====

export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface CreateUsuarioResponse {
  message: string;
  userId: string;
  email: string;
  contrasenaTemporal: string;
}

export interface ToggleStatusResponse {
  message: string;
  userId: string;
  estadoAnterior: string;
  estadoActual: string;
  cambiadoPor: string;
  fechaCambio: string;
}

// ===== ESTADOS DE FORMULARIOS =====

export interface FiltrosState {
  busquedaGeneral: string;
  departamentoId: string;
  rol: string;
  estaActivo?: boolean;
  extranjero?: boolean;
  fechaIngresoDesde: string;
  fechaIngresoHasta: string;
}

// ===== CONFIGURACIÓN DE TABLA =====

export interface ColumnConfig {
  key: keyof UsuarioAdmin;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// ===== CONSTANTES =====

export const ESTADOS_USUARIO = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo'
} as const;

export const TAMANOS_PAGINA = [10, 20, 50, 100] as const;

export const CAMPOS_ORDENAMIENTO = {
  NOMBRE: 'nombrecompleto',
  EMAIL: 'email',
  FECHA_INGRESO: 'fechaingreso',
  EMPRESA: 'empresa',
  DEPARTAMENTO: 'departamento',
  ESTADO: 'estaactivo'
} as const;

// ===== TIPOS HELPER =====

export type UsuarioId = string;
export type TamañoPagina = typeof TAMANOS_PAGINA[number];
export type EstadoUsuario = typeof ESTADOS_USUARIO[keyof typeof ESTADOS_USUARIO];

// ============================================================================
// INTERFACES PARA ESTADO DE TABLA Y FORMULARIOS
// ============================================================================

export interface UsuarioAdminTableState {
  usuarios: UsuarioAdmin[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsuarioFormState {
  // Datos básicos
  email: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellidos: string; // Campo calculado
  dni: string;
  telefono: string;
  fechaNacimiento: string;
  extranjero: boolean;
  
  // Datos laborales
  fechaIngreso: string;
  departamentoId: string;
  jefeId: string;
  rol: string;
  estaActivo: boolean;
  
  // Para edición
  id?: string;
}

export interface UsuarioValidationErrors {
  email?: string;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
  departamentoId?: string;
  jefeId?: string;
  rol?: string;
  [key: string]: string | undefined;
}
export type CampoOrdenamiento = typeof CAMPOS_ORDENAMIENTO[keyof typeof CAMPOS_ORDENAMIENTO];

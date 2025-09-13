// ============================================================================
// TIPOS TYPESCRIPT PARA GESTIÓN DE ROLES
// ============================================================================
// Estos tipos corresponden exactamente a los DTOs del backend
// Mantener sincronizados con el backend en sistema_vacaciones_back/DTOs/Rol/
// ============================================================================

// ===== TIPOS BÁSICOS =====

export interface Permiso {
  id: string;
  nombreRuta: string; // Cambio: coincide con el DTO del backend
  descripcion: string;
  modulo?: string; // Opcional ya que no viene en el DTO del backend
}

export interface RolAdmin {
  id: string;
  name: string;
  descripcion: string;
  numeroPersonas: number;
  estado: string; // "activo" | "inactivo"
  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
  isDeleted: boolean;
  permisos: Permiso[];
}

// ===== QUERY OBJECTS =====

export interface RolesAdminQueryObject {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

// ===== RESPONSE TYPES =====

export interface RolesAdminResponse {
  roles: RolAdmin[];
  total: number;
  totalCompleto: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
  consultadoPor: string;
}

export interface PermisosResponse {
  total: number;
  permisos: Permiso[];
  consultadoPor: string;
}

// ===== REQUEST TYPES =====

export interface CreateRolDto {
  name: string;
  descripcion: string;
  permisos: string[];
}

export interface UpdateRolDto {
  id: string;
  name: string;
  descripcion: string;
  permisos: string[];
}

// ===== RESPONSE TYPES PARA OPERACIONES =====

export interface CreateRolResponse {
  rol: RolAdmin;
  creadoPor: string;
}

export interface UpdateRolResponse {
  rol: RolAdmin;
  actualizadoPor: string;
}

export interface DeleteRolResponse {
  message: string;
  eliminadoPor: string;
}

// ===== TIPOS PARA HOOKS =====

export interface RolAdminTableState {
  roles: RolAdmin[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RolFormState {
  id?: string;
  name: string;
  descripcion: string;
  permisos: string[];
}

export interface RolValidationErrors {
  name?: string;
  descripcion?: string;
  permisos?: string;
}

// ===== TIPOS GENERALES =====

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

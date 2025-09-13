// ============================================================================
// TIPOS Y INTERFACES PARA GESTIÓN DE PERMISOS
// ============================================================================
// Este archivo define todas las interfaces TypeScript para el módulo de
// gestión de permisos, incluyendo DTOs, estados de UI y validaciones
// ============================================================================

// ============================================================================
// INTERFACES BÁSICAS DE PERMISO
// ============================================================================

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  codigoPermiso: string;
  numeroRoles: number;
  createdOn: string;
  createdBy: string;
  updatedOn?: string;
  updatedBy?: string;
  isActive: boolean;
}

export interface CreatePermisoDto {
  nombre: string;
  descripcion: string;
  modulo: string;
  codigoPermiso: string;
}

export interface UpdatePermisoDto {
  nombre: string;
  descripcion: string;
  modulo: string;
  codigoPermiso: string;
  isActive: boolean;
}

// ============================================================================
// QUERY OBJECTS Y RESPONSES
// ============================================================================

export interface PermisosQueryObject {
  searchTerm?: string;
  modulo?: string;
  isActive?: boolean;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface PermisosEstadisticas {
  totalPermisosActivos: number;
  totalPermisosInactivos: number;
  totalModulos: number;
  promedioPermisosPorModulo: number;
}

export interface PermisosAdminResponse {
  permisos: Permiso[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  modulosDisponibles: string[];
  estadisticas: PermisosEstadisticas;
}

// ============================================================================
// ESTADOS DE LA UI
// ============================================================================

export interface PermisoAdminTableState {
  permisos: Permiso[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  modulosDisponibles: string[];
  estadisticas: PermisosEstadisticas;
  searchTerm: string;
  filtroModulo: string;
  filtroEstado: string;
  sortBy: string;
  isDescending: boolean;
}

export interface PermisoFormState {
  permiso: CreatePermisoDto | UpdatePermisoDto;
  loading: boolean;
  error: string | null;
  success: boolean;
  isEditing: boolean;
  permisoOriginal: Permiso | null;
}

// ============================================================================
// VALIDACIONES Y ERRORES
// ============================================================================

export interface PermisoValidationErrors {
  nombre?: string;
  descripcion?: string;
  modulo?: string;
  codigoPermiso?: string;
  general?: string;
}

export interface PermisoDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  permiso: Permiso | null;
}

// ============================================================================
// FILTROS Y OPCIONES
// ============================================================================

export interface PermisosFiltros {
  searchTerm: string;
  modulo: string;
  estado: string;
  sortBy: string;
  isDescending: boolean;
}

export interface ModuloOption {
  key: string;
  text: string;
}

export interface EstadoOption {
  key: string;
  text: string;
}

// ============================================================================
// ACCIONES DE LA TABLA
// ============================================================================

export interface PermisoTableAction {
  type: 'edit' | 'delete' | 'toggle-status' | 'view-audit';
  permiso: Permiso;
}

// ============================================================================
// CONFIGURACIÓN DE COLUMNAS
// ============================================================================

export interface PermisoTableColumn {
  key: string;
  name: string;
  fieldName?: string;
  minWidth: number;
  maxWidth?: number;
  isResizable?: boolean;
  isSorted?: boolean;
  isSortedDescending?: boolean;
  sortAscendingAriaLabel?: string;
  sortDescendingAriaLabel?: string;
}

// ============================================================================
// PROPS DE COMPONENTES
// ============================================================================

export interface PermisoModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  permiso?: Permiso;
  onSuccess: () => void;
}

export interface EstadoPermisoModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  permiso: Permiso;
  onSuccess: () => void;
}

export interface ConfirmDeletePermisoModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  permiso: Permiso;
  onSuccess: () => void;
}

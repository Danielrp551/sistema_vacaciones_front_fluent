// ============================================================================
// API CLIENT PARA GESTIÓN DE PERMISOS
// ============================================================================
// Este archivo maneja todas las llamadas HTTP al backend para operaciones
// CRUD de permisos, incluyendo filtrado, paginación y auditoría
// ============================================================================

import { axiosInstance } from './axios';
import type {
  PermisosQueryObject,
  PermisosAdminResponse,
  Permiso,
  CreatePermisoDto,
  UpdatePermisoDto,
  PermisosEstadisticas
} from '../types/permisos';

// ============================================================================
// ENDPOINTS BASE
// ============================================================================

const PERMISOS_BASE_URL = '/Permiso';

// ============================================================================
// OPERACIONES DE CONSULTA
// ============================================================================

/**
 * Obtiene lista paginada de permisos con filtros
 */
export const getPermisos = async (queryObject: PermisosQueryObject = {}): Promise<PermisosAdminResponse> => {
  const params = new URLSearchParams();
  
  if (queryObject.searchTerm) params.append('searchTerm', queryObject.searchTerm);
  if (queryObject.modulo) params.append('modulo', queryObject.modulo);
  if (queryObject.isActive !== undefined) params.append('isActive', queryObject.isActive.toString());
  if (queryObject.sortBy) params.append('sortBy', queryObject.sortBy);
  if (queryObject.isDescending !== undefined) params.append('isDescending', queryObject.isDescending.toString());
  if (queryObject.pageNumber) params.append('pageNumber', queryObject.pageNumber.toString());
  if (queryObject.pageSize) params.append('pageSize', queryObject.pageSize.toString());

  const queryString = params.toString();
  const url = queryString ? `${PERMISOS_BASE_URL}?${queryString}` : PERMISOS_BASE_URL;
  
  const response = await axiosInstance.get<PermisosAdminResponse>(url);
  return response.data;
};

/**
 * Obtiene un permiso específico por ID
 */
export const getPermisoById = async (id: string): Promise<Permiso> => {
  const response = await axiosInstance.get<Permiso>(`${PERMISOS_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Obtiene lista de módulos disponibles
 */
export const getModulos = async (): Promise<string[]> => {
  const response = await axiosInstance.get<string[]>(`${PERMISOS_BASE_URL}/modulos`);
  return response.data;
};

/**
 * Obtiene estadísticas de permisos
 */
export const getEstadisticas = async (): Promise<PermisosEstadisticas> => {
  const response = await axiosInstance.get<PermisosEstadisticas>(`${PERMISOS_BASE_URL}/estadisticas`);
  return response.data;
};

// ============================================================================
// OPERACIONES DE MODIFICACIÓN
// ============================================================================

/**
 * Crea un nuevo permiso
 */
export const createPermiso = async (permisoData: CreatePermisoDto): Promise<Permiso> => {
  const response = await axiosInstance.post<Permiso>(PERMISOS_BASE_URL, permisoData);
  return response.data;
};

/**
 * Actualiza un permiso existente
 */
export const updatePermiso = async (id: string, permisoData: UpdatePermisoDto): Promise<Permiso> => {
  const response = await axiosInstance.put<Permiso>(`${PERMISOS_BASE_URL}/${id}`, permisoData);
  return response.data;
};

/**
 * Elimina un permiso (soft delete)
 */
export const deletePermiso = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await axiosInstance.delete<{ message: string; id: string }>(`${PERMISOS_BASE_URL}/${id}`);
  return response.data;
};

// ============================================================================
// UTILIDADES Y VALIDACIONES
// ============================================================================

/**
 * Valida si un permiso puede ser eliminado
 */
export const canDeletePermiso = (permiso: Permiso): boolean => {
  return permiso.numeroRoles === 0;
};

/**
 * Obtiene el mensaje de error apropiado para validaciones
 */
export const getValidationErrorMessage = (error: any): string => {
  if (error.response?.status === 409) {
    return 'Ya existe un permiso con ese nombre o código';
  }
  if (error.response?.status === 400) {
    return error.response.data?.message || 'Datos inválidos';
  }
  if (error.response?.status === 404) {
    return 'Permiso no encontrado';
  }
  return 'Error interno del servidor';
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Construye query object con valores por defecto
 */
export const buildQueryObject = (params: Partial<PermisosQueryObject>): PermisosQueryObject => {
  return {
    pageNumber: 1,
    pageSize: 20,
    isDescending: false,
    ...params
  };
};

/**
 * Normaliza nombre de módulo para filtros
 */
export const normalizeModuleName = (modulo: string): string => {
  return modulo.trim().toLowerCase();
};

/**
 * Formatea fecha para mostrar en la UI
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

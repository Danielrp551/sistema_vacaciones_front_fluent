// ============================================================================
// SERVICIO API PARA GESTIÓN DE ROLES ADMINISTRATIVOS
// ============================================================================
// Este archivo contiene todas las llamadas a los endpoints del backend
// Corresponde a los endpoints implementados en RolController.cs
// ============================================================================

import { axiosInstance } from './axios';
import type {
  RolesAdminQueryObject,
  RolesAdminResponse,
  PermisosResponse,
  CreateRolDto,
  CreateRolResponse,
  UpdateRolDto,
  UpdateRolResponse,
  DeleteRolResponse,
  RolAdmin
} from '../types/roles';

// ============================================================================
// CONFIGURACIÓN BASE
// ============================================================================

const ROLES_BASE_URL = '/rol';

// ============================================================================
// 1. ENDPOINTS DE CONSULTA Y LISTADO
// ============================================================================

/**
 * Obtiene una lista paginada de roles con filtros
 */
export const getRolesAdmin = async (
  query: RolesAdminQueryObject = {}
): Promise<RolesAdminResponse> => {
  const params = new URLSearchParams();
  
  // Filtros de búsqueda
  if (query.name) {
    params.append('Name', query.name);
  }
  
  // Paginación
  if (query.pageNumber) {
    params.append('PageNumber', query.pageNumber.toString());
  }
  if (query.pageSize) {
    params.append('PageSize', query.pageSize.toString());
  }
  
  // Ordenamiento
  if (query.sortBy) {
    params.append('SortBy', query.sortBy);
  }
  if (query.isDescending !== undefined) {
    params.append('IsDescending', query.isDescending.toString());
  }
  
  const response = await axiosInstance.get(`${ROLES_BASE_URL}/get-rol-pagination?${params.toString()}`);
  return response.data;
};

/**
 * Obtiene todos los permisos disponibles para asignar a roles
 */
export const getPermisos = async (): Promise<PermisosResponse> => {
  const response = await axiosInstance.get(`${ROLES_BASE_URL}/get-permisos`);
  return response.data;
};

/**
 * Obtiene un rol específico por ID
 */
export const getRolById = async (rolId: string): Promise<{ rol: RolAdmin; consultadoPor: string }> => {
  const response = await axiosInstance.get(`${ROLES_BASE_URL}/get-rol/${rolId}`);
  return response.data;
};

// ============================================================================
// 2. ENDPOINTS DE OPERACIONES CRUD
// ============================================================================

/**
 * Crea un nuevo rol
 */
export const createRol = async (rolData: CreateRolDto): Promise<CreateRolResponse> => {
  const response = await axiosInstance.post(`${ROLES_BASE_URL}/crear-rol`, rolData);
  return response.data;
};

/**
 * Actualiza un rol existente
 */
export const updateRol = async (rolData: UpdateRolDto): Promise<UpdateRolResponse> => {
  const response = await axiosInstance.put(`${ROLES_BASE_URL}/actualizar-rol`, rolData);
  return response.data;
};

/**
 * Elimina un rol (soft delete)
 */
export const deleteRol = async (rolId: string): Promise<DeleteRolResponse> => {
  const response = await axiosInstance.delete(`${ROLES_BASE_URL}/eliminar-rol/${rolId}`);
  return response.data;
};

/**
 * Cambia el estado de un rol (activo/inactivo)
 */
export const cambiarEstadoRol = async (rolId: string): Promise<{ message: string; nuevoEstado: string; cambiadoPor: string }> => {
  const response = await axiosInstance.put(`${ROLES_BASE_URL}/cambiar-estado-rol/${rolId}`);
  return response.data;
};

// ============================================================================
// 3. HELPERS PARA MANEJO DE ERRORES
// ============================================================================

/**
 * Extrae el mensaje de error de una respuesta de API
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).join(', ');
    }
    return errors.toString();
  }
  
  if (error.response?.data) {
    return error.response.data.toString();
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Error desconocido';
};

/**
 * Maneja errores de validación específicos del formulario
 */
export const handleValidationErrors = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    const serverErrors = error.response.data.errors;
    
    // Si es un array de strings
    if (Array.isArray(serverErrors)) {
      serverErrors.forEach((err: string, index: number) => {
        errors[`error_${index}`] = err;
      });
    } else if (typeof serverErrors === 'object') {
      // Si viene un objeto con errores por campo
      Object.keys(serverErrors).forEach(field => {
        errors[field.toLowerCase()] = serverErrors[field];
      });
    }
  }
  
  return errors;
};

// ============================================================================
// EXPORT DEFAULT CON TODAS LAS FUNCIONES
// ============================================================================

export default {
  // Consulta y listado
  getRolesAdmin,
  getPermisos,
  getRolById,
  
  // CRUD
  createRol,
  updateRol,
  deleteRol,
  cambiarEstadoRol,
  
  // Helpers
  extractErrorMessage,
  handleValidationErrors
};

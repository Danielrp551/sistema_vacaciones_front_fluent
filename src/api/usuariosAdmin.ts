// ============================================================================
// CLIENTE API PARA GESTIÓN DE USUARIOS ADMINISTRATIVOS
// ============================================================================
// Este archivo contiene todas las llamadas a los endpoints del backend
// Corresponde a los endpoints implementados en UsuarioAdminController.cs
// ============================================================================

import { axiosInstance } from './axios';
import type {
  UsuariosAdminQueryObject,
  UsuariosAdminResponse,
  UsuarioDetalle,
  UsuariosEstadisticas,
  CreateUsuarioDto,
  CreateUsuarioResponse,
  UpdateUsuarioDto,
  ResetPasswordDto,
  ResetPasswordResponse,
  ToggleStatusResponse,
  DepartamentoSimple,
  UsuarioSimple,
  ApiResponse
} from '../types/usuarios';

// ============================================================================
// CONFIGURACIÓN BASE
// ============================================================================

const USUARIOS_ADMIN_BASE_URL = '/usuarios-admin';

// ============================================================================
// 1. ENDPOINTS DE CONSULTA Y LISTADO
// ============================================================================

/**
 * Obtiene una lista paginada de usuarios con filtros avanzados
 */
export const getUsuariosAdmin = async (
  query: UsuariosAdminQueryObject
): Promise<UsuariosAdminResponse> => {
  const params = new URLSearchParams();
  
  // Paginación
  params.append('PageNumber', query.pageNumber.toString());
  params.append('PageSize', query.pageSize.toString());
  
  // Ordenamiento
  if (query.sortBy) {
    params.append('SortBy', query.sortBy);
  }
  params.append('IsDescending', query.isDescending.toString());
  
  // Filtros de búsqueda
  if (query.busquedaGeneral) {
    params.append('BusquedaGeneral', query.busquedaGeneral);
  }
  if (query.email) {
    params.append('Email', query.email);
  }
  if (query.departamentoId) {
    params.append('DepartamentoId', query.departamentoId);
  }
  if (query.rol) {
    params.append('Rol', query.rol);
  }
  if (query.estaActivo !== undefined) {
    params.append('EstaActivo', query.estaActivo.toString());
  }
  if (query.extranjero !== undefined) {
    params.append('Extranjero', query.extranjero.toString());
  }
  
  // Filtros de fecha
  if (query.fechaIngresoDesde) {
    params.append('FechaIngresoDesde', query.fechaIngresoDesde);
  }
  if (query.fechaIngresoHasta) {
    params.append('FechaIngresoHasta', query.fechaIngresoHasta);
  }
  
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}?${params.toString()}`);
  return response.data;
};

/**
 * Obtiene los detalles completos de un usuario específico
 */
export const getUsuarioById = async (id: string): Promise<UsuarioDetalle> => {
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Obtiene estadísticas generales del sistema de usuarios
 */
export const getEstadisticasUsuarios = async (): Promise<UsuariosEstadisticas> => {
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/estadisticas`);
  return response.data;
};

// ============================================================================
// 2. ENDPOINTS DE DATOS DE APOYO (DROPDOWNS)
// ============================================================================

/**
 * Obtiene lista de departamentos para dropdowns
 */
export const getDepartamentos = async (soloActivos = true): Promise<DepartamentoSimple[]> => {
  const params = new URLSearchParams();
  params.append('soloActivos', soloActivos.toString());
  
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/dropdowns/departamentos?${params.toString()}`);
  return response.data;
};

/**
 * Obtiene lista de roles disponibles en el sistema
 */
export const getRoles = async (): Promise<string[]> => {
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/dropdowns/roles`);
  return response.data;
};

/**
 * Obtiene lista de usuarios que pueden ser asignados como jefes
 */
export const getJefes = async (soloActivos = true): Promise<UsuarioSimple[]> => {
  const params = new URLSearchParams();
  params.append('soloActivos', soloActivos.toString());
  
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/dropdowns/jefes?${params.toString()}`);
  return response.data;
};

// ============================================================================
// 3. ENDPOINTS DE VALIDACIÓN
// ============================================================================

/**
 * Valida si un email ya está en uso
 */
export const validateEmail = async (
  email: string, 
  excludeUserId?: string
): Promise<boolean> => {
  const params = new URLSearchParams();
  params.append('email', email);
  if (excludeUserId) {
    params.append('excludeUserId', excludeUserId);
  }
  
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/validate/email?${params.toString()}`);
  return response.data;
};

/**
 * Valida si un DNI ya está en uso
 */
export const validateDni = async (
  dni: string, 
  excludeUserId?: string
): Promise<boolean> => {
  const params = new URLSearchParams();
  params.append('dni', dni);
  if (excludeUserId) {
    params.append('excludeUserId', excludeUserId);
  }
  
  const response = await axiosInstance.get(`${USUARIOS_ADMIN_BASE_URL}/validate/dni?${params.toString()}`);
  return response.data;
};

// ============================================================================
// 4. ENDPOINTS DE GESTIÓN CRUD
// ============================================================================

/**
 * Crea un nuevo usuario en el sistema
 */
export const createUsuario = async (
  usuarioData: CreateUsuarioDto
): Promise<CreateUsuarioResponse> => {
  const response = await axiosInstance.post(USUARIOS_ADMIN_BASE_URL, usuarioData);
  return response.data;
};

/**
 * Actualiza la información de un usuario existente
 */
export const updateUsuario = async (
  id: string, 
  usuarioData: UpdateUsuarioDto
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.put(`${USUARIOS_ADMIN_BASE_URL}/${id}`, usuarioData);
  return response.data;
};

/**
 * Elimina un usuario del sistema (soft delete)
 */
export const deleteUsuario = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`${USUARIOS_ADMIN_BASE_URL}/${id}`);
  return response.data;
};

// ============================================================================
// 5. ENDPOINTS DE SEGURIDAD
// ============================================================================

/**
 * Reinicia la contraseña de un usuario
 */
export const resetPassword = async (
  id: string, 
  resetData?: ResetPasswordDto
): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post(
    `${USUARIOS_ADMIN_BASE_URL}/${id}/reset-password`, 
    resetData || { usuarioId: id }
  );
  return response.data;
};

/**
 * Activa o desactiva un usuario (toggle del estado)
 */
export const toggleUserStatus = async (id: string): Promise<ToggleStatusResponse> => {
  const response = await axiosInstance.post(`${USUARIOS_ADMIN_BASE_URL}/${id}/toggle-status`);
  return response.data;
};

// ============================================================================
// FUNCIONES HELPER PARA MANEJO DE ERRORES
// ============================================================================

/**
 * Extrae mensaje de error de la respuesta de la API
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.join(', ');
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido';
};

/**
 * Maneja errores específicos de validación
 */
export const handleValidationErrors = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    // Si viene un array de errores
    if (Array.isArray(error.response.data.errors)) {
      error.response.data.errors.forEach((err: string, index: number) => {
        errors[`error_${index}`] = err;
      });
    } else {
      // Si viene un objeto con errores por campo
      Object.keys(error.response.data.errors).forEach(field => {
        errors[field] = error.response.data.errors[field];
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
  getUsuariosAdmin,
  getUsuarioById,
  getEstadisticasUsuarios,
  
  // Datos de apoyo
  getDepartamentos,
  getRoles,
  getJefes,
  
  // Validaciones
  validateEmail,
  validateDni,
  
  // CRUD
  createUsuario,
  updateUsuario,
  deleteUsuario,
  
  // Seguridad
  resetPassword,
  toggleUserStatus,
  
  // Helpers
  extractErrorMessage,
  handleValidationErrors
};

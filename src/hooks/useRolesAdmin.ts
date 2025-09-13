// ============================================================================
// CUSTOM HOOKS PARA GESTIÓN DE ROLES ADMINISTRATIVOS
// ============================================================================
// Este archivo contiene hooks personalizados que manejan el estado y 
// operaciones CRUD de roles, incluyendo validaciones y manejo de errores
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type {
  RolesAdminQueryObject,
  RolAdmin,
  Permiso,
  CreateRolDto,
  UpdateRolDto,
  RolAdminTableState,
  RolFormState,
  RolValidationErrors
} from '../types/roles';
import * as rolesAdminAPI from '../api/rolesAdmin';

// ============================================================================
// HOOK PRINCIPAL PARA LA TABLA DE ROLES
// ============================================================================

export const useRolesAdmin = () => {
  const [state, setState] = useState<RolAdminTableState>({
    roles: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [query, setQuery] = useState<RolesAdminQueryObject>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    isDescending: false
  });

  // Función para cargar roles
  const loadRoles = useCallback(async (queryParams?: Partial<RolesAdminQueryObject>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const finalQuery = { ...query, ...queryParams };
      const response = await rolesAdminAPI.getRolesAdmin(finalQuery);
      
      setState(prev => ({
        ...prev,
        roles: response.roles,
        totalCount: response.totalCompleto,
        currentPage: response.paginaActual,
        pageSize: response.tamanoPagina,
        hasNextPage: response.tienePaginaSiguiente,
        hasPreviousPage: response.tienePaginaAnterior,
        loading: false
      }));
      
      setQuery(finalQuery);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: rolesAdminAPI.extractErrorMessage(error)
      }));
    }
  }, [query]);

  // Función para cambiar página
  const changePage = useCallback((page: number) => {
    loadRoles({ pageNumber: page });
  }, [loadRoles]);

  // Función para cambiar tamaño de página
  const changePageSize = useCallback((size: number) => {
    loadRoles({ pageNumber: 1, pageSize: size });
  }, [loadRoles]);

  // Función para aplicar filtros
  const applyFilters = useCallback((filters: Partial<RolesAdminQueryObject>) => {
    loadRoles({ pageNumber: 1, ...filters });
  }, [loadRoles]);

  // Función para ordenar
  const changeSorting = useCallback((sortBy: string, isDescending?: boolean) => {
    const newIsDescending = isDescending !== undefined ? isDescending : !query.isDescending;
    loadRoles({ sortBy, isDescending: newIsDescending });
  }, [loadRoles, query.isDescending]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    const baseQuery: RolesAdminQueryObject = {
      pageNumber: 1,
      pageSize: query.pageSize,
      sortBy: 'name',
      isDescending: false
    };
    loadRoles(baseQuery);
  }, [loadRoles, query.pageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRoles();
  }, []);

  return {
    ...state,
    query,
    loadRoles,
    changePage,
    changePageSize,
    applyFilters,
    changeSorting,
    clearFilters,
    refresh: () => loadRoles()
  };
};

// ============================================================================
// HOOK PARA OBTENER PERMISOS DISPONIBLES
// ============================================================================

export const usePermisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPermisos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rolesAdminAPI.getPermisos();
      setPermisos(response.permisos);
    } catch (error) {
      setError(rolesAdminAPI.extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermisos();
  }, []);

  return {
    permisos,
    loading,
    error,
    refresh: loadPermisos
  };
};

// ============================================================================
// HOOK PARA OBTENER ROL ESPECÍFICO POR ID
// ============================================================================

export const useRolById = (rolId: string | null) => {
  const [rol, setRol] = useState<RolAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRol = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rolesAdminAPI.getRolById(id);
      setRol(response.rol);
    } catch (error) {
      setError(rolesAdminAPI.extractErrorMessage(error));
      setRol(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rolId) {
      loadRol(rolId);
    } else {
      setRol(null);
      setError(null);
    }
  }, [rolId, loadRol]);

  return {
    rol,
    loading,
    error,
    refresh: () => rolId && loadRol(rolId),
    clearError: () => setError(null)
  };
};

// ============================================================================
// HOOK PARA FORMULARIO DE ROL
// ============================================================================

export const useRolForm = (
  initialData?: RolAdmin,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  const [formData, setFormData] = useState<RolFormState>({
    name: '',
    descripcion: '',
    permisos: []
  });

  const [validationErrors, setValidationErrors] = useState<RolValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para actualizar campo del formulario
  const updateField = useCallback(<K extends keyof RolFormState>(
    field: K,
    value: RolFormState[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de validación del campo
    if (validationErrors[field as keyof RolValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [validationErrors]);

  // Función para validar formulario
  const validateForm = useCallback((): boolean => {
    const errors: RolValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre del rol es requerido';
    } else if (formData.name.trim().length < 5) {
      errors.name = 'El nombre debe tener al menos 5 caracteres';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción del rol es requerida';
    } else if (formData.descripcion.trim().length < 5) {
      errors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    if (!formData.permisos.length) {
      errors.permisos = 'Debe seleccionar al menos un permiso';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Función para enviar formulario
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (formData.id) {
        // Actualización
        const updateData: UpdateRolDto = {
          id: formData.id,
          name: formData.name.trim(),
          descripcion: formData.descripcion.trim(),
          permisos: formData.permisos
        };
        
        await rolesAdminAPI.updateRol(updateData);
      } else {
        // Creación
        const createData: CreateRolDto = {
          name: formData.name.trim(),
          descripcion: formData.descripcion.trim(),
          permisos: formData.permisos
        };
        
        await rolesAdminAPI.createRol(createData);
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage = rolesAdminAPI.extractErrorMessage(error);
      const fieldErrors = rolesAdminAPI.handleValidationErrors(error);
      
      setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess, onError]);

  // Función para resetear formulario
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      descripcion: '',
      permisos: []
    });
    setValidationErrors({});
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        descripcion: initialData.descripcion,
        permisos: initialData.permisos.map(p => p.id)
      });
    }
  }, [initialData]);

  return {
    formData,
    validationErrors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    resetForm,
    isEditing: !!formData.id
  };
};

// ============================================================================
// HOOK PARA OPERACIONES DE ROL (DELETE)
// ============================================================================

export const useRolOperations = (onSuccess?: (message: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete rol
  const deleteRol = useCallback(async (rolId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rolesAdminAPI.deleteRol(rolId);
      onSuccess?.(response.message || 'Rol eliminado correctamente');
    } catch (error) {
      const errorMessage = rolesAdminAPI.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return {
    loading,
    error,
    deleteRol,
    clearError: () => setError(null)
  };
};

// ============================================================================
// HOOK PARA CAMBIAR ESTADO DE ROL
// ============================================================================

export const useCambiarEstadoRol = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiarEstado = useCallback(async (rolId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await rolesAdminAPI.cambiarEstadoRol(rolId);
      onSuccess?.();
      return response;
    } catch (error) {
      const errorMessage = rolesAdminAPI.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return {
    loading,
    error,
    cambiarEstado,
    clearError: () => setError(null)
  };
};

// ============================================================================
// CUSTOM HOOKS PARA GESTIÓN DE PERMISOS ADMINISTRATIVOS
// ============================================================================
// Este archivo contiene hooks personalizados que manejan el estado y 
// operaciones CRUD de permisos, incluyendo validaciones y manejo de errores
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type {
  PermisosQueryObject,
  Permiso,
  CreatePermisoDto,
  UpdatePermisoDto,
  PermisoAdminTableState,
  PermisoFormState,
  PermisoValidationErrors,
  PermisoDeleteState
} from '../types/permisos';
import * as permisosAdminAPI from '../api/permisosAdmin';

// ============================================================================
// HOOK PRINCIPAL PARA LA TABLA DE PERMISOS
// ============================================================================

export const usePermisosAdmin = () => {
  const [state, setState] = useState<PermisoAdminTableState>({
    permisos: [],
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 20,
    modulosDisponibles: [],
    estadisticas: {
      totalPermisosActivos: 0,
      totalPermisosInactivos: 0,
      totalModulos: 0,
      promedioPermisosPorModulo: 0
    },
    searchTerm: '',
    filtroModulo: '',
    filtroEstado: '',
    sortBy: 'nombre',
    isDescending: false
  });

  // ============================================================================
  // FUNCIÓN PRINCIPAL DE CARGA DE DATOS
  // ============================================================================
  
  const loadPermisos = useCallback(async (queryObject?: PermisosQueryObject) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const query = permisosAdminAPI.buildQueryObject({
        searchTerm: state.searchTerm || undefined,
        modulo: state.filtroModulo || undefined,
        isActive: state.filtroEstado ? state.filtroEstado === 'activo' : undefined,
        sortBy: state.sortBy,
        isDescending: state.isDescending,
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        ...queryObject
      });

      const response = await permisosAdminAPI.getPermisos(query);
      
      setState(prev => ({
        ...prev,
        permisos: response.permisos,
        totalCount: response.totalRecords,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        modulosDisponibles: response.modulosDisponibles,
        estadisticas: response.estadisticas,
        loading: false,
        error: null
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: permisosAdminAPI.getValidationErrorMessage(error)
      }));
    }
  }, [state.searchTerm, state.filtroModulo, state.filtroEstado, state.sortBy, state.isDescending, state.currentPage, state.pageSize]);

  // ============================================================================
  // FUNCIONES DE FILTRADO Y BÚSQUEDA
  // ============================================================================

  const setSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm, currentPage: 1 }));
  }, []);

  const setFiltroModulo = useCallback((modulo: string) => {
    setState(prev => ({ ...prev, filtroModulo: modulo, currentPage: 1 }));
  }, []);

  const setFiltroEstado = useCallback((estado: string) => {
    setState(prev => ({ ...prev, filtroEstado: estado, currentPage: 1 }));
  }, []);

  // ============================================================================
  // FUNCIONES DE ORDENAMIENTO
  // ============================================================================

  const changeSorting = useCallback((sortBy: string, isDescending: boolean) => {
    setState(prev => ({ ...prev, sortBy, isDescending, currentPage: 1 }));
  }, []);

  // ============================================================================
  // FUNCIONES DE PAGINACIÓN
  // ============================================================================

  const changePage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const changePageSize = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
  }, []);

  // ============================================================================
  // FUNCIONES DE LIMPIEZA
  // ============================================================================

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchTerm: '',
      filtroModulo: '',
      filtroEstado: '',
      currentPage: 1
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    loadPermisos();
  }, [loadPermisos]);

  return {
    // Estado
    ...state,
    
    // Funciones de carga
    loadPermisos,
    
    // Funciones de filtrado
    setSearchTerm,
    setFiltroModulo,
    setFiltroEstado,
    
    // Funciones de ordenamiento
    changeSorting,
    
    // Funciones de paginación
    changePage,
    changePageSize,
    
    // Funciones de utilidad
    clearFilters,
    clearError
  };
};

// ============================================================================
// HOOK PARA FORMULARIO DE PERMISO
// ============================================================================

export const usePermisoForm = (
  permisoInicial?: Permiso,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  const [state, setState] = useState<PermisoFormState>({
    permiso: permisoInicial ? {
      nombre: permisoInicial.nombre,
      descripcion: permisoInicial.descripcion,
      modulo: permisoInicial.modulo,
      codigoPermiso: permisoInicial.codigoPermiso,
      isActive: permisoInicial.isActive
    } : {
      nombre: '',
      descripcion: '',
      modulo: '',
      codigoPermiso: ''
    },
    loading: false,
    error: null,
    success: false,
    isEditing: !!permisoInicial,
    permisoOriginal: permisoInicial || null
  });

  // ============================================================================
  // EFECTOS - Actualizar formulario cuando cambian los datos
  // ============================================================================

  useEffect(() => {
    if (permisoInicial) {
      setState(prev => ({
        ...prev,
        permiso: {
          nombre: permisoInicial.nombre,
          descripcion: permisoInicial.descripcion,
          modulo: permisoInicial.modulo,
          codigoPermiso: permisoInicial.codigoPermiso,
          isActive: permisoInicial.isActive
        },
        isEditing: true,
        permisoOriginal: permisoInicial
      }));
    }
  }, [permisoInicial]);

  // ============================================================================
  // VALIDACIONES
  // ============================================================================

  const validateForm = useCallback((): PermisoValidationErrors => {
    const errors: PermisoValidationErrors = {};
    
    if (!state.permiso.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (state.permiso.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!state.permiso.descripcion?.trim()) {
      errors.descripcion = 'La descripción es requerida';
    } else if (state.permiso.descripcion.length < 10) {
      errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!state.permiso.modulo?.trim()) {
      errors.modulo = 'El módulo es requerido';
    } else if (state.permiso.modulo.length < 3) {
      errors.modulo = 'El módulo debe tener al menos 3 caracteres';
    }
    
    if (!state.permiso.codigoPermiso?.trim()) {
      errors.codigoPermiso = 'El código del permiso es requerido';
    } else if (state.permiso.codigoPermiso.length < 3) {
      errors.codigoPermiso = 'El código debe tener al menos 3 caracteres';
    }
    
    return errors;
  }, [state.permiso]);

  // ============================================================================
  // FUNCIONES DE FORMULARIO
  // ============================================================================

  const updateField = useCallback((field: keyof (CreatePermisoDto & UpdatePermisoDto), value: string | boolean) => {
    setState(prev => ({
      ...prev,
      permiso: { ...prev.permiso, [field]: value },
      error: null
    }));
  }, []);

  const submitForm = useCallback(async (): Promise<boolean> => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      const errorMessage = 'Por favor corrige los errores en el formulario';
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      if (state.isEditing && state.permisoOriginal) {
        await permisosAdminAPI.updatePermiso(state.permisoOriginal.id, state.permiso as UpdatePermisoDto);
      } else {
        await permisosAdminAPI.createPermiso(state.permiso as CreatePermisoDto);
      }
      
      setState(prev => ({ ...prev, loading: false, success: true }));
      onSuccess?.();
      return true;
    } catch (error: any) {
      const errorMessage = permisosAdminAPI.getValidationErrorMessage(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      onError?.(errorMessage);
      return false;
    }
  }, [state.permiso, state.isEditing, state.permisoOriginal, validateForm, onSuccess, onError]);

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      permiso: prev.permisoOriginal ? {
        nombre: prev.permisoOriginal.nombre,
        descripcion: prev.permisoOriginal.descripcion,
        modulo: prev.permisoOriginal.modulo,
        codigoPermiso: prev.permisoOriginal.codigoPermiso,
        isActive: prev.permisoOriginal.isActive
      } : {
        nombre: '',
        descripcion: '',
        modulo: '',
        codigoPermiso: ''
      },
      error: null,
      success: false
    }));
  }, []);

  return {
    // Estado
    ...state,
    formData: state.permiso,
    isSubmitting: state.loading,
    validationErrors: validateForm(),
    isValid: Object.keys(validateForm()).length === 0,
    
    // Funciones
    updateField,
    submitForm,
    resetForm,
    validateForm
  };
};

// ============================================================================
// HOOK PARA ELIMINAR PERMISO
// ============================================================================

export const useDeletePermiso = () => {
  const [state, setState] = useState<PermisoDeleteState>({
    loading: false,
    error: null,
    success: false,
    permiso: null
  });

  const deletePermiso = useCallback(async (permiso: Permiso): Promise<boolean> => {
    if (!permisosAdminAPI.canDeletePermiso(permiso)) {
      setState(prev => ({
        ...prev,
        error: 'No se puede eliminar el permiso porque está asignado a uno o más roles',
        permiso
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null, permiso }));
    
    try {
      await permisosAdminAPI.deletePermiso(permiso.id);
      setState(prev => ({ ...prev, loading: false, success: true }));
      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: permisosAdminAPI.getValidationErrorMessage(error)
      }));
      return false;
    }
  }, []);

  const clearState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      permiso: null
    });
  }, []);

  return {
    ...state,
    deletePermiso,
    clearState
  };
};

// ============================================================================
// HOOK PARA OBTENER PERMISO POR ID
// ============================================================================

export const usePermisoById = (permisoId: string | null) => {
  const [state, setState] = useState<{
    permiso: Permiso | null;
    loading: boolean;
    error: string | null;
  }>({
    permiso: null,
    loading: false,
    error: null
  });

  const loadPermiso = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const permiso = await permisosAdminAPI.getPermisoById(id);
      setState(prev => ({ ...prev, permiso, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: permisosAdminAPI.getValidationErrorMessage(error)
      }));
    }
  }, []);

  useEffect(() => {
    if (permisoId) {
      loadPermiso(permisoId);
    } else {
      setState({ permiso: null, loading: false, error: null });
    }
  }, [permisoId, loadPermiso]);

  return {
    ...state,
    reload: () => permisoId && loadPermiso(permisoId)
  };
};

// ============================================================================
// HOOK PARA OBTENER MÓDULOS DISPONIBLES
// ============================================================================

export const useModulosDisponibles = () => {
  const [state, setState] = useState<{
    modulos: string[];
    loading: boolean;
    error: string | null;
  }>({
    modulos: [],
    loading: false,
    error: null
  });

  const loadModulos = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const modulos = await permisosAdminAPI.getModulos();
      setState(prev => ({ ...prev, modulos, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: permisosAdminAPI.getValidationErrorMessage(error)
      }));
    }
  }, []);

  useEffect(() => {
    loadModulos();
  }, [loadModulos]);

  return {
    ...state,
    reload: loadModulos
  };
};

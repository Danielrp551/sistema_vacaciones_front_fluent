// ============================================================================
// CUSTOM HOOKS PARA GESTIÓN DE USUARIOS ADMINISTRATIVOS
// ============================================================================
// Este archivo contiene hooks personalizados que manejan el estado y 
// operaciones CRUD de usuarios, incluyendo validaciones y manejo de errores
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type {
  UsuariosAdminQueryObject,
  UsuarioDetalle,
  UsuariosEstadisticas,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  DepartamentoSimple,
  UsuarioSimple,
  UsuarioAdminTableState,
  UsuarioFormState,
  UsuarioValidationErrors
} from '../types/usuarios';
import * as usuariosAdminAPI from '../api/usuariosAdmin';

// ============================================================================
// HOOK PRINCIPAL PARA LA TABLA DE USUARIOS
// ============================================================================

export const useUsuariosAdmin = () => {
  const [state, setState] = useState<UsuarioAdminTableState>({
    usuarios: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [query, setQuery] = useState<UsuariosAdminQueryObject>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'fechaCreacion',
    isDescending: true
  });

  // Función para cargar usuarios
  const loadUsuarios = useCallback(async (queryParams?: Partial<UsuariosAdminQueryObject>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const finalQuery = { ...query, ...queryParams };
      const response = await usuariosAdminAPI.getUsuariosAdmin(finalQuery);
      
      setState(prev => ({
        ...prev,
        usuarios: response.usuarios,
        totalCount: response.total,
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
        error: usuariosAdminAPI.extractErrorMessage(error)
      }));
    }
  }, [query]);

  // Función para cambiar página
  const changePage = useCallback((page: number) => {
    loadUsuarios({ pageNumber: page });
  }, [loadUsuarios]);

  // Función para cambiar tamaño de página
  const changePageSize = useCallback((size: number) => {
    loadUsuarios({ pageNumber: 1, pageSize: size });
  }, [loadUsuarios]);

  // Función para aplicar filtros
  const applyFilters = useCallback((filters: Partial<UsuariosAdminQueryObject>) => {
    loadUsuarios({ pageNumber: 1, ...filters });
  }, [loadUsuarios]);

  // Función para ordenar
  const changeSorting = useCallback((sortBy: string, isDescending?: boolean) => {
    const newIsDescending = isDescending !== undefined ? isDescending : !query.isDescending;
    loadUsuarios({ sortBy, isDescending: newIsDescending });
  }, [loadUsuarios, query.isDescending]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    const baseQuery: UsuariosAdminQueryObject = {
      pageNumber: 1,
      pageSize: query.pageSize,
      sortBy: 'fechaCreacion',
      isDescending: true
    };
    loadUsuarios(baseQuery);
  }, [loadUsuarios, query.pageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    loadUsuarios();
  }, []);

  return {
    ...state,
    query,
    loadUsuarios,
    changePage,
    changePageSize,
    applyFilters,
    changeSorting,
    clearFilters,
    refresh: () => loadUsuarios()
  };
};

// ============================================================================
// HOOK PARA DETALLES DE USUARIO
// ============================================================================

export const useUsuarioDetalle = (usuarioId: string | null) => {
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsuario = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usuariosAdminAPI.getUsuarioById(id);
      setUsuario(response);
    } catch (error) {
      setError(usuariosAdminAPI.extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usuarioId) {
      loadUsuario(usuarioId);
    } else {
      setUsuario(null);
      setError(null);
    }
  }, [usuarioId, loadUsuario]);

  return {
    usuario,
    loading,
    error,
    refresh: () => usuarioId && loadUsuario(usuarioId)
  };
};

// ============================================================================
// HOOK PARA ESTADÍSTICAS DE USUARIOS
// ============================================================================

export const useUsuariosEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState<UsuariosEstadisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usuariosAdminAPI.getEstadisticasUsuarios();
      setEstadisticas(response);
    } catch (error) {
      setError(usuariosAdminAPI.extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    refresh: loadEstadisticas
  };
};

// ============================================================================
// HOOK PARA DATOS DE APOYO (DROPDOWNS)
// ============================================================================

export const useUsuariosDropdowns = () => {
  const [departamentos, setDepartamentos] = useState<DepartamentoSimple[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [jefes, setJefes] = useState<UsuarioSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDropdowns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [departamentosRes, rolesRes, jefesRes] = await Promise.all([
        usuariosAdminAPI.getDepartamentos(),
        usuariosAdminAPI.getRoles(),
        usuariosAdminAPI.getJefes()
      ]);
      
      setDepartamentos(departamentosRes);
      setRoles(rolesRes);
      setJefes(jefesRes);
    } catch (error) {
      setError(usuariosAdminAPI.extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDropdowns();
  }, []);

  return {
    departamentos,
    roles,
    jefes,
    loading,
    error,
    refresh: loadDropdowns
  };
};

// ============================================================================
// HOOK PARA FORMULARIO DE USUARIO
// ============================================================================

export const useUsuarioForm = (
  initialData?: UsuarioDetalle,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  const [formData, setFormData] = useState<UsuarioFormState>({
    // Datos básicos
    email: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    apellidos: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    extranjero: false,
    
    // Datos laborales
    fechaIngreso: '',
    departamentoId: '',
    jefeId: '',
    rol: '',
    estaActivo: true,
    
    // Para edición
    id: undefined
  });

  const [validationErrors, setValidationErrors] = useState<UsuarioValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para actualizar campo del formulario
  const updateField = useCallback(<K extends keyof UsuarioFormState>(
    field: K,
    value: UsuarioFormState[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de validación del campo
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [validationErrors]);

  // Función para validar email
  const validateEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const isAvailable = await usuariosAdminAPI.validateEmail(email, formData.id);
      if (!isAvailable) {
        setValidationErrors(prev => ({ 
          ...prev, 
          email: 'Este email ya está en uso por otro usuario' 
        }));
        return false;
      }
      return true;
    } catch (error) {
      setValidationErrors(prev => ({ 
        ...prev, 
        email: 'Error al validar el email' 
      }));
      return false;
    }
  }, [formData.id]);

  // Función para validar DNI
  const validateDni = useCallback(async (dni: string): Promise<boolean> => {
    try {
      const isAvailable = await usuariosAdminAPI.validateDni(dni, formData.id);
      if (!isAvailable) {
        setValidationErrors(prev => ({ 
          ...prev, 
          dni: 'Este DNI ya está en uso por otro usuario' 
        }));
        return false;
      }
      return true;
    } catch (error) {
      setValidationErrors(prev => ({ 
        ...prev, 
        dni: 'Error al validar el DNI' 
      }));
      return false;
    }
  }, [formData.id]);

  // Función para validar formulario completo
  const validateForm = useCallback((): boolean => {
    const errors: UsuarioValidationErrors = {};

    // Validaciones básicas
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    }
    if (!formData.nombres.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    if (!formData.dni.trim()) {
      errors.dni = 'El DNI es requerido';
    }
    if (!formData.departamentoId) {
      errors.departamentoId = 'El departamento es requerido';
    }
    if (!formData.rol) {
      errors.rol = 'El rol es requerido';
    }
    if (!formData.fechaIngreso) {
      errors.fechaIngreso = 'La fecha de ingreso es requerida';
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
      // Validaciones asíncronas
      const [emailValid, dniValid] = await Promise.all([
        validateEmail(formData.email),
        validateDni(formData.dni)
      ]);

      if (!emailValid || !dniValid) {
        setIsSubmitting(false);
        return;
      }

      // Enviar datos
      if (formData.id) {
        // Actualización
        const updateData: UpdateUsuarioDto = {
          email: formData.email,
          nombres: formData.nombres,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          dni: formData.dni,
          telefono: formData.telefono || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          extranjero: formData.extranjero,
          fechaIngreso: formData.fechaIngreso,
          departamentoId: formData.departamentoId,
          jefeId: formData.jefeId || undefined,
          rol: formData.rol,
          estaActivo: formData.estaActivo
        };
        
        await usuariosAdminAPI.updateUsuario(formData.id, updateData);
      } else {
        // Creación
        const createData: CreateUsuarioDto = {
          email: formData.email,
          nombres: formData.nombres,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          dni: formData.dni,
          telefono: formData.telefono || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          extranjero: formData.extranjero,
          fechaIngreso: formData.fechaIngreso,
          departamentoId: formData.departamentoId,
          jefeId: formData.jefeId || undefined,
          rol: formData.rol
        };
        
        await usuariosAdminAPI.createUsuario(createData);
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage = usuariosAdminAPI.extractErrorMessage(error);
      const fieldErrors = usuariosAdminAPI.handleValidationErrors(error);
      
      setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, validateEmail, validateDni, onSuccess, onError]);

  // Función para resetear formulario
  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      apellidos: '',
      dni: '',
      telefono: '',
      fechaNacimiento: '',
      extranjero: false,
      fechaIngreso: '',
      departamentoId: '',
      jefeId: '',
      rol: '',
      estaActivo: true,
      id: undefined
    });
    setValidationErrors({});
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        nombres: initialData.nombres,
        apellidoPaterno: initialData.apellidoPaterno || '',
        apellidoMaterno: initialData.apellidoMaterno || '',
        apellidos: initialData.apellidos,
        dni: initialData.dni,
        telefono: initialData.telefono || '',
        fechaNacimiento: initialData.fechaNacimiento || '',
        extranjero: initialData.extranjero,
        fechaIngreso: initialData.fechaIngreso,
        departamentoId: initialData.departamentoId || '',
        jefeId: initialData.jefeId || '',
        rol: initialData.rol,
        estaActivo: initialData.estaActivo,
        id: initialData.id
      });
    }
  }, [initialData]);

  return {
    formData,
    validationErrors,
    isSubmitting,
    updateField,
    validateEmail,
    validateDni,
    validateForm,
    submitForm,
    resetForm,
    isEditing: !!formData.id
  };
};

// ============================================================================
// HOOK PARA OPERACIONES DE USUARIO (RESET PASSWORD, TOGGLE STATUS, DELETE)
// ============================================================================

export const useUsuarioOperations = (onSuccess?: (message: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset password
  const resetPassword = useCallback(async (usuarioId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usuariosAdminAPI.resetPassword(usuarioId);
      onSuccess?.(`Contraseña reiniciada. Nueva contraseña: ${response.nuevaPassword}`);
      return response;
    } catch (error) {
      const errorMessage = usuariosAdminAPI.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  // Toggle status
  const toggleStatus = useCallback(async (usuarioId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usuariosAdminAPI.toggleUserStatus(usuarioId);
      onSuccess?.(response.message);
      return response;
    } catch (error) {
      const errorMessage = usuariosAdminAPI.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  // Delete user
  const deleteUser = useCallback(async (usuarioId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await usuariosAdminAPI.deleteUsuario(usuarioId);
      onSuccess?.('Usuario eliminado correctamente');
    } catch (error) {
      const errorMessage = usuariosAdminAPI.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return {
    loading,
    error,
    resetPassword,
    toggleStatus,
    deleteUser,
    clearError: () => setError(null)
  };
};

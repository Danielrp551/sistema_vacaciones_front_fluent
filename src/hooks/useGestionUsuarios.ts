import { useState, useCallback } from 'react';
import * as gestionUsuariosService from '../services/gestionUsuarios.service';
import type { 
  CreateUsuarioRequest, 
  CreateUsuarioResponse,
  UpdateUsuarioRequest,
  ToggleUserStatusResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UsuariosDropdownsResponse,
  UsuarioDetalle
} from '../services/gestionUsuarios.service';

// ============================================================================
// INTERFACES PARA EL HOOK
// ============================================================================

export interface CreateUsuarioFormData {
  // Información personal
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  extranjero: boolean;
  numeroCelular?: string;
  
  // Información de cuenta
  email: string;
  contrasenaTemporal?: string;
  forzarCambioContrasena: boolean;
  
  // Información laboral
  fechaIngreso: string; // formato YYYY-MM-DD
  empresa: string;
  departamentoId: string;
  jefeId?: string;
  
  // Configuración
  roles: string[];
  estadoInicial: boolean;
}

export interface FormErrors {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  dni?: string;
  numeroCelular?: string;
  email?: string;
  contrasenaTemporal?: string;
  fechaIngreso?: string;
  empresa?: string;
  departamentoId?: string;
  roles?: string;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useGestionUsuarios = () => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================
  
  const [isCreatingUsuario, setIsCreatingUsuario] = useState(false);
  const [createUsuarioError, setCreateUsuarioError] = useState<string | null>(null);
  const [createUsuarioFieldErrors, setCreateUsuarioFieldErrors] = useState<FormErrors>({});

  // ============================================================================
  // FUNCIÓN CREAR USUARIO
  // ============================================================================

  const createUsuario = useCallback(async (
    formData: CreateUsuarioFormData,
    onSuccess?: (response: CreateUsuarioResponse) => void,
    onError?: (error: string, fieldErrors?: FormErrors) => void
  ) => {
    setIsCreatingUsuario(true);
    setCreateUsuarioError(null);
    setCreateUsuarioFieldErrors({});

    try {
      // Mapear FormData a Request DTO
      const requestData: CreateUsuarioRequest = {
        // Información personal
        nombres: formData.nombres.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim(),
        dni: formData.dni.trim(),
        extranjero: formData.extranjero,
        numeroCelular: formData.numeroCelular?.trim() || undefined,
        
        // Información de cuenta
        email: formData.email.trim(),
        contrasenaTemporal: formData.contrasenaTemporal?.trim() || undefined,
        forzarCambioContrasena: formData.forzarCambioContrasena,
        
        // Información laboral
        fechaIngreso: formData.fechaIngreso,
        empresa: formData.empresa.trim(),
        departamentoId: formData.departamentoId,
        jefeId: formData.jefeId || undefined,
        
        // Configuración
        roles: formData.roles,
        estadoInicial: formData.estadoInicial,
      };

      const response = await gestionUsuariosService.createUsuario(requestData);
      
      onSuccess?.(response);
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      const fieldErrors = gestionUsuariosService.handleValidationErrors(error);
      
      setCreateUsuarioError(errorMessage);
      setCreateUsuarioFieldErrors(fieldErrors);
      
      onError?.(errorMessage, fieldErrors);
    } finally {
      setIsCreatingUsuario(false);
    }
  }, []);

  // ============================================================================
  // RETURN DEL HOOK
  // ============================================================================

  return {
    // Estado
    isCreatingUsuario,
    createUsuarioError,
    createUsuarioFieldErrors,
    
    // Funciones
    createUsuario,
    
    // Limpiar errores
    clearCreateUsuarioError: () => setCreateUsuarioError(null),
    clearCreateUsuarioFieldErrors: () => setCreateUsuarioFieldErrors({}),
  };
};

// ============================================================================
// HOOK PARA DROPDOWNS
// ============================================================================

export const useUsuariosDropdowns = () => {
  const [dropdowns, setDropdowns] = useState<UsuariosDropdownsResponse>({
    departamentos: [],
    roles: [],
    jefes: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDropdowns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await gestionUsuariosService.getUsuariosDropdowns();
      setDropdowns(data);
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    departamentos: dropdowns.departamentos,
    roles: dropdowns.roles,
    jefes: dropdowns.jefes,
    loading,
    error,
    fetchDropdowns,
    clearError: () => setError(null),
  };
};

// ============================================================================
// HOOK PARA OBTENER USUARIO POR ID
// ============================================================================

export const useUsuarioDetalle = () => {
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsuario = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await gestionUsuariosService.getUsuarioById(id);
      setUsuario(data);
      return data;
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const mapToFormData = useCallback((usuarioData?: UsuarioDetalle) => {
    const dataToMap = usuarioData || usuario;
    if (!dataToMap) return null;
    
    return gestionUsuariosService.mapUsuarioToFormData(dataToMap);
  }, [usuario]);

  const clearUsuario = useCallback(() => {
    setUsuario(null);
    setError(null);
  }, []);

  return {
    usuario,
    loading,
    error,
    getUsuario,
    mapToFormData,
    clearUsuario,
    clearError: () => setError(null),
  };
};

// ============================================================================
// HOOK PARA ACTUALIZAR USUARIO
// ============================================================================

export const useUpdateUsuario = () => {
  const [isUpdatingUsuario, setIsUpdatingUsuario] = useState(false);
  const [updateUsuarioError, setUpdateUsuarioError] = useState<string | null>(null);
  const [updateUsuarioFieldErrors, setUpdateUsuarioFieldErrors] = useState<FormErrors>({});

  const updateUsuario = useCallback(async (
    id: string,
    formData: CreateUsuarioFormData,
    options?: {
      onSuccess?: (message: string) => void;
      onError?: (message: string, fieldErrors: FormErrors) => void;
    }
  ) => {
    const { onSuccess, onError } = options || {};
    
    setIsUpdatingUsuario(true);
    setUpdateUsuarioError(null);
    setUpdateUsuarioFieldErrors({});
    
    try {
      // Mapear formData a UpdateUsuarioRequest
      const requestData: UpdateUsuarioRequest = {
        // Información personal
        nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        dni: formData.dni,
        extranjero: formData.extranjero,
        numeroCelular: formData.numeroCelular,
        
        // Información de cuenta
        email: formData.email,
        forzarCambioContrasena: formData.forzarCambioContrasena,
        
        // Información laboral
        fechaIngreso: formData.fechaIngreso,
        empresa: formData.empresa,
        departamentoId: formData.departamentoId,
        jefeId: formData.jefeId,
        
        // Configuración
        roles: formData.roles,
        estaActivo: formData.estadoInicial, // mapear estadoInicial -> estaActivo
      };

      const response = await gestionUsuariosService.updateUsuario(id, requestData);
      
      onSuccess?.(response.message || 'Usuario actualizado correctamente');
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      const fieldErrors = gestionUsuariosService.handleValidationErrors(error);
      
      setUpdateUsuarioError(errorMessage);
      setUpdateUsuarioFieldErrors(fieldErrors);
      
      onError?.(errorMessage, fieldErrors);
    } finally {
      setIsUpdatingUsuario(false);
    }
  }, []);

  return {
    // Estado
    isUpdatingUsuario,
    updateUsuarioError,
    updateUsuarioFieldErrors,
    
    // Funciones
    updateUsuario,
    
    // Limpiar errores
    clearUpdateUsuarioError: () => setUpdateUsuarioError(null),
    clearUpdateUsuarioFieldErrors: () => setUpdateUsuarioFieldErrors({}),
  };
};

// ============================================================================
// HOOK PARA TOGGLE USER STATUS
// ============================================================================

export const useToggleUserStatus = () => {
  const [isTogglingUserStatus, setIsTogglingUserStatus] = useState(false);
  const [toggleUserStatusError, setToggleUserStatusError] = useState<string | null>(null);

  const toggleUserStatus = useCallback(async (
    id: string,
    onSuccess?: (message: string, response: ToggleUserStatusResponse) => void,
    onError?: (error: string) => void
  ) => {
    setIsTogglingUserStatus(true);
    setToggleUserStatusError(null);
    
    try {
      const response = await gestionUsuariosService.toggleUserStatus(id);
      
      onSuccess?.(response.message || 'Estado del usuario cambiado exitosamente', response);
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      
      setToggleUserStatusError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsTogglingUserStatus(false);
    }
  }, []);

  return {
    // Estado
    isTogglingUserStatus,
    toggleUserStatusError,
    
    // Funciones
    toggleUserStatus,
    
    // Limpiar errores
    clearToggleUserStatusError: () => setToggleUserStatusError(null),
  };
};

export const useResetPassword = () => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);

  const resetPassword = useCallback(async (
    id: string,
    resetData?: ResetPasswordRequest,
    onSuccess?: (message: string, response: ResetPasswordResponse) => void,
    onError?: (error: string) => void
  ) => {
    setIsResettingPassword(true);
    setResetPasswordError(null);
    
    try {
      const response = await gestionUsuariosService.resetPassword(id, resetData);
      
      onSuccess?.(response.message || 'Contraseña reiniciada exitosamente', response);
    } catch (error: any) {
      const errorMessage = gestionUsuariosService.extractErrorMessage(error);
      
      setResetPasswordError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  }, []);

  return {
    // Estado
    isResettingPassword,
    resetPasswordError,
    
    // Funciones
    resetPassword,
    
    // Limpiar errores
    clearResetPasswordError: () => setResetPasswordError(null),
  };
};

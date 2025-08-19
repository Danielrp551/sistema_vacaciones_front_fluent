import axiosInstance from './axiosInstance';

// ============================================================================
// INTERFACES DE REQUEST Y RESPONSE
// ============================================================================

export interface CreateUsuarioRequest {
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

export interface CreateUsuarioResponse {
  success: boolean;
  message: string;
  data?: {
    usuarioId: string;
    personaId: string;
    email: string;
    contrasenaGenerada?: string;
  };
}

export interface UpdateUsuarioRequest {
  // Información personal
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  extranjero: boolean;
  numeroCelular?: string;
  
  // Información de cuenta
  email: string;
  forzarCambioContrasena: boolean;
  
  // Información laboral
  fechaIngreso: string; // formato YYYY-MM-DD
  empresa: string;
  departamentoId: string;
  jefeId?: string;
  
  // Configuración
  roles: string[];
  estaActivo: boolean;
}

export interface UpdateUsuarioResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface ToggleUserStatusResponse {
  success: boolean;
  message: string;
  userId: string;
  estadoAnterior: string;
  estadoActual: string;
  cambiadoPor: string;
  fechaCambio: string;
}

export interface ResetPasswordRequest {
  usuarioId: string;
  motivo?: string;
}

export interface ResetPasswordResponse {
  message: string;
  userId: string;
  contrasenaTemporal: string;
  forzarCambio: boolean;
  resetPor: string;
  fechaReset: string;
}

export interface UsuarioDepartamento {
  id: string;
  nombre: string;
}

export interface UsuarioJefe {
  id: string;
  nombreCompleto: string;
}

export interface UsuariosDropdownsResponse {
  departamentos: UsuarioDepartamento[];
  roles: string[];
  jefes: UsuarioJefe[];
}

export interface UsuarioDetalle {
  id: string;
  // Información personal
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  dni: string;
  extranjero: boolean;
  numeroCelular?: string;
  
  // Información de cuenta
  email: string;
  userName: string;
  debeChangePassword: boolean;
  emailConfirmed: boolean;
  ultimoLogin?: string;
  
  // Información laboral
  fechaIngreso: string;
  empresa?: string;
  departamentoId?: string;
  departamento?: string;
  codigoDepartamento?: string;
  jefeId?: string;
  manager?: string;
  emailManager?: string;
  numeroSubordinados: number;
  
  // Configuración y roles
  roles: string[];
  estado: string;
  estaActivo: boolean;
  
  // Auditoría
  creadoPor: string;
  fechaCreacion: string;
  actualizadoPor?: string;
  fechaActualizacion?: string;
  
  // Estadísticas
  tiempoEnEmpresa: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const GESTION_USUARIOS_BASE_URL = '/usuarios-admin';

// ============================================================================
// SERVICIOS DE API
// ============================================================================

/**
 * Servicio para gestión de usuarios - Crear nuevo usuario
 */
export const createUsuario = async (
  usuarioData: CreateUsuarioRequest
): Promise<CreateUsuarioResponse> => {
  try {
    const response = await axiosInstance.post(GESTION_USUARIOS_BASE_URL, usuarioData);
    return response.data;
  } catch (error: any) {
    // Re-throw el error para que sea manejado por el hook
    throw error;
  }
};

/**
 * Servicio para obtener departamentos para dropdowns
 */
export const getDepartamentos = async (): Promise<UsuarioDepartamento[]> => {
  try {
    const response = await axiosInstance.get(`${GESTION_USUARIOS_BASE_URL}/dropdowns/departamentos`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Servicio para obtener roles para dropdowns
 */
export const getRoles = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`${GESTION_USUARIOS_BASE_URL}/dropdowns/roles`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Servicio para obtener jefes para dropdowns
 */
export const getJefes = async (): Promise<UsuarioJefe[]> => {
  try {
    const response = await axiosInstance.get(`${GESTION_USUARIOS_BASE_URL}/dropdowns/jefes`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Servicio para obtener todos los dropdowns necesarios para crear usuarios
 */
export const getUsuariosDropdowns = async (): Promise<UsuariosDropdownsResponse> => {
  try {
    const [departamentos, roles, jefes] = await Promise.all([
      getDepartamentos(),
      getRoles(),
      getJefes()
    ]);
    
    return {
      departamentos,
      roles,
      jefes
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Servicio para obtener detalles de un usuario específico
 */
export const getUsuarioById = async (id: string): Promise<UsuarioDetalle> => {
  try {
    const response = await axiosInstance.get(`${GESTION_USUARIOS_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Servicio para actualizar un usuario existente
 */
export const updateUsuario = async (
  id: string,
  usuarioData: UpdateUsuarioRequest
): Promise<UpdateUsuarioResponse> => {
  try {
    const response = await axiosInstance.put(`${GESTION_USUARIOS_BASE_URL}/${id}`, usuarioData);
    return response.data;
  } catch (error: any) {
    // Re-throw el error para que sea manejado por el hook
    throw error;
  }
};

/**
 * Cambia el estado (activo/inactivo) de un usuario
 */
export const toggleUserStatus = async (id: string): Promise<ToggleUserStatusResponse> => {
  try {
    const response = await axiosInstance.post(`${GESTION_USUARIOS_BASE_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    // Re-throw el error para que sea manejado por el hook
    throw error;
  }
};

export const resetPassword = async (
  id: string, 
  resetData?: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    // Asegurar que siempre se envíe el usuarioId en el body
    const requestBody = {
      usuarioId: id,
      ...resetData
    };
    
    const response = await axiosInstance.post(
      `${GESTION_USUARIOS_BASE_URL}/${id}/reset-password`,
      requestBody
    );
    return response.data;
  } catch (error: any) {
    // Re-throw el error para que sea manejado por el hook
    throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extrae mensaje de error del response de axios
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstErrorKey = Object.keys(errors)[0];
    return errors[firstErrorKey][0] || 'Error de validación';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Error desconocido al procesar la solicitud';
};

/**
 * Maneja errores de validación del backend
 */
export const handleValidationErrors = (error: any): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    Object.keys(errors).forEach(field => {
      // Convertir el nombre del campo del backend al frontend
      const frontendField = mapBackendFieldToFrontend(field);
      fieldErrors[frontendField] = errors[field][0] || 'Error de validación';
    });
  }
  
  return fieldErrors;
};

/**
 * Mapea nombres de campos del backend al frontend
 */
const mapBackendFieldToFrontend = (backendField: string): string => {
  const fieldMapping: Record<string, string> = {
    'Nombres': 'nombres',
    'ApellidoPaterno': 'apellidoPaterno',
    'ApellidoMaterno': 'apellidoMaterno',
    'Dni': 'dni',
    'NumeroCelular': 'numeroCelular',
    'Email': 'email',
    'ContrasenaTemporal': 'contrasenaTemporal',
    'FechaIngreso': 'fechaIngreso',
    'Empresa': 'empresa',
    'DepartamentoId': 'departamentoId',
    'JefeId': 'jefeId',
    'Roles': 'roles',
  };
  
  return fieldMapping[backendField] || backendField.toLowerCase();
};

/**
 * Mapea UsuarioDetalle del backend a CreateUsuarioFormData para el formulario
 */
export const mapUsuarioToFormData = (usuario: UsuarioDetalle) => {
  // Convertir fecha de ISO string a formato YYYY-MM-DD
  const fechaIngreso = usuario.fechaIngreso ? 
    new Date(usuario.fechaIngreso).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];

  return {
    // Información personal
    nombres: usuario.nombres || '',
    apellidoPaterno: usuario.apellidoPaterno || '',
    apellidoMaterno: usuario.apellidoMaterno || '',
    dni: usuario.dni || '',
    extranjero: usuario.extranjero || false,
    numeroCelular: usuario.numeroCelular || '',
    
    // Información de cuenta
    email: usuario.email || '',
    contrasenaTemporal: '', // No se muestra en modo view
    forzarCambioContrasena: usuario.debeChangePassword || true,
    
    // Información laboral
    fechaIngreso: fechaIngreso,
    empresa: usuario.empresa || '',
    departamentoId: usuario.departamentoId || '',
    jefeId: usuario.jefeId || '', // Mantener como string vacío para el formulario
    
    // Configuración
    roles: usuario.roles || [],
    estadoInicial: usuario.estaActivo || true,
  };
};

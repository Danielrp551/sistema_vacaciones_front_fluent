// ============================================================================
// TIPOS PARA BULK IMPORT DE USUARIOS
// ============================================================================

export interface BulkImportUsuario {
  numeroFila: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  email: string;
  codigoDepartamento: string;
  dniJefe?: string;
  fechaIngreso: string; // DD/MM/YYYY
  extranjero: string; // "SI" o "NO"
  empresa: string;
  roles?: string; // Separados por comas
  
  // Campos de control
  esValido?: boolean;
  errores?: string[];
}

export interface BulkImportConfiguracion {
  departamentoPorDefecto?: string;
  rolesPorDefecto: string[];
  generarPasswordsAutomaticamente: boolean;
  continuarConErrores: boolean;
  empresaPorDefecto?: string;
  validarJefesExistentes: boolean;
  enviarNotificacionEmail: boolean;
}

export interface BulkImportMetadata {
  nombreArchivo: string;
  tipoArchivo: string;
  tamanoArchivo: number;
  fechaProcesamiento: string;
  totalFilas: number;
  filasConDatos: number;
  filasOmitidas: number;
  erroresParsing: string[];
  advertencias: string[];
  tiempoProcesamiento: number;
  columnasEncontradas: string[];
  esExitoso: boolean;
  resumen: string;
}

export interface BulkImportRequest {
  usuarios: BulkImportUsuario[];
  configuracion: BulkImportConfiguracion;
  metadata: BulkImportMetadata;
}

export interface BulkImportError {
  numeroFila: number;
  campo: string;
  valorIncorrecto: string;
  tipoError: string;
  mensaje: string;
  sugerencia: string;
  esCritico: boolean;
}

export interface BulkImportUsuarioResult {
  numeroFila: number;
  usuarioId: string;
  email: string;
  nombreCompleto: string;
  dni: string;
  dniJefe?: string;
  contrasenaTemporal: string;
  rolesAsignados: string[];
  departamento: string;
  fechaCreacion: string;
  requiereCambioContrasena: boolean;
}

export interface BulkImportEstadisticas {
  totalRegistrosProcesados: number;
  usuariosCreados: number;
  registrosFallidos: number;
  tiempoProcesamiento: number;
  tasaExito: number;
  erroresCriticos: number;
  advertencias: number;
  fechaProcesamiento: string;
}

export interface BulkImportResult {
  esExitoso: boolean;
  mensaje: string;
  fechaProcesamiento: string;
  
  // Usuarios procesados
  usuariosCreados: BulkImportUsuarioResult[];
  registrosFallidos: BulkImportError[];
  
  // Estadísticas
  estadisticas: BulkImportEstadisticas;
  
  // Metadatos del archivo
  metadata: BulkImportMetadata;
  
  // Información de auditoría
  adminId: string;
  ipAddress: string;
  detallesAuditoria: {
    accionesRealizadas: string[];
    erroresDetectados: string[];
    tiempoTotal: number;
  };
}

export interface BulkImportValidationResult {
  esValido: boolean;
  metadata: BulkImportMetadata;
  usuariosEncontrados: number;
  erroresArchivo: string[];
  erroresValidacion: BulkImportError[];
  advertencias: string[];
  columnasEncontradas: string[];
  columnasEsperadas: string[];
}

export interface ColumnInfo {
  columnas: string[];
  total: number;
  descripcion: string;
  formato: string;
}

// ============================================================================
// TIPOS DE ERROR Y ESTADO
// ============================================================================

export type TipoErrorBulkImport = 
  | 'CAMPO_REQUERIDO'
  | 'FORMATO_INVALIDO'
  | 'DNI_DUPLICADO'
  | 'EMAIL_DUPLICADO'
  | 'DEPARTAMENTO_NO_ENCONTRADO'
  | 'JEFE_NO_ENCONTRADO'
  | 'ROL_NO_ENCONTRADO'
  | 'FECHA_INVALIDA'
  | 'DNI_EXISTENTE'
  | 'EMAIL_EXISTENTE'
  | 'JERARQUIA_CIRCULAR'
  | 'LONGITUD_EXCEDIDA'
  | 'CARACTERES_INVALIDOS'
  | 'USUARIO_YA_EXISTE'
  | 'ERROR_CREACION_USUARIO'
  | 'ERROR_BASE_DATOS';

export type EstadoBulkImport = 
  | 'idle'
  | 'archivo-seleccionado'
  | 'validando'
  | 'validado'
  | 'validacion-fallida'
  | 'procesando'
  | 'completado'
  | 'error'
  | 'cancelado';

// ============================================================================
// TIPOS DE ARCHIVO
// ============================================================================

export interface ArchivoInfo {
  archivo: File;
  nombre: string;
  tamano: number;
  tipo: string;
  extension: string;
  esValido: boolean;
  errores: string[];
}

export interface ConfiguracionArchivo {
  tiposPermitidos: string[];
  tamanoMaximo: number; // en bytes
  extensionesPermitidas: string[];
}

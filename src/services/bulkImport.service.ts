import axiosInstance from './axiosInstance';
import type {
  BulkImportResult,
  BulkImportValidationResult,
  BulkImportConfiguracion,
  ColumnInfo,
  ArchivoInfo,
  ConfiguracionArchivo,
  BulkImportUsuario,
  BulkImportMetadata
} from '../types/bulkImport';

// ============================================================================
// CONFIGURACIÓN DEL SERVICIO
// ============================================================================

const BULK_IMPORT_ENDPOINTS = {
  PROCESS: '/bulkimport/process',
  VALIDATE: '/bulkimport/validate',
  TEMPLATE_EXCEL: '/bulkimport/template/excel',
  TEMPLATE_CSV: '/bulkimport/template/csv',
  COLUMNS: '/bulkimport/columns'
} as const;

const ARCHIVO_CONFIG: ConfiguracionArchivo = {
  tiposPermitidos: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
    'application/vnd.ms-excel', // Excel legacy
    'text/csv', // CSV
    'application/csv'
  ],
  tamanoMaximo: 10 * 1024 * 1024, // 10 MB
  extensionesPermitidas: ['.xlsx', '.xls', '.csv']
};

// ============================================================================
// UTILIDADES DE ARCHIVO
// ============================================================================

/**
 * Valida un archivo antes de procesarlo
 */
export const validarArchivo = (archivo: File): ArchivoInfo => {
  const extension = '.' + archivo.name.split('.').pop()?.toLowerCase();
  const info: ArchivoInfo = {
    archivo,
    nombre: archivo.name,
    tamano: archivo.size,
    tipo: archivo.type,
    extension: extension || '',
    esValido: true,
    errores: []
  };

  // Validar extensión
  if (!ARCHIVO_CONFIG.extensionesPermitidas.includes(info.extension)) {
    info.esValido = false;
    info.errores.push(`Extensión no permitida. Extensiones válidas: ${ARCHIVO_CONFIG.extensionesPermitidas.join(', ')}`);
  }

  // Validar tamaño
  if (archivo.size > ARCHIVO_CONFIG.tamanoMaximo) {
    info.esValido = false;
    const tamanoMb = (ARCHIVO_CONFIG.tamanoMaximo / (1024 * 1024)).toFixed(1);
    info.errores.push(`El archivo excede el tamaño máximo de ${tamanoMb} MB`);
  }

  // Validar que no esté vacío
  if (archivo.size === 0) {
    info.esValido = false;
    info.errores.push('El archivo está vacío');
  }

  // Validar tipo MIME si está disponible
  if (archivo.type && !ARCHIVO_CONFIG.tiposPermitidos.includes(archivo.type)) {
    info.esValido = false;
    info.errores.push(`Tipo de archivo no válido: ${archivo.type}`);
  }

  return info;
};

/**
 * Crea la configuración por defecto para bulk import
 */
export const crearConfiguracionPorDefecto = (): BulkImportConfiguracion => ({
  rolesPorDefecto: ['Empleado'],
  generarPasswordsAutomaticamente: true,
  continuarConErrores: false,
  validarJefesExistentes: true,
  enviarNotificacionEmail: false
});

// ============================================================================
// SERVICIOS DE API
// ============================================================================

/**
 * Procesa un archivo de bulk import de usuarios
 */
export const procesarBulkImport = async (
  archivo: File,
  configuracion?: BulkImportConfiguracion
): Promise<BulkImportResult> => {
  try {
    const formData = new FormData();
    formData.append('file', archivo);
    
    if (configuracion) {
      formData.append('configuracion', JSON.stringify(configuracion));
    }

    const response = await axiosInstance.post<BulkImportResult>(
      BULK_IMPORT_ENDPOINTS.PROCESS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutos para archivos grandes
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Error al procesar el archivo de bulk import');
    }
    throw new Error('Error de conexión al procesar bulk import');
  }
};

/**
 * Valida un archivo de bulk import sin procesarlo
 */
export const validarBulkImport = async (archivo: File): Promise<BulkImportValidationResult> => {
  try {
    const formData = new FormData();
    formData.append('file', archivo);

    const response = await axiosInstance.post<BulkImportValidationResult>(
      BULK_IMPORT_ENDPOINTS.VALIDATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minuto para validación
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Error al validar el archivo');
    }
    throw new Error('Error de conexión al validar archivo');
  }
};

/**
 * Descarga la plantilla Excel para bulk import
 */
export const descargarPlantillaExcel = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(BULK_IMPORT_ENDPOINTS.TEMPLATE_EXCEL, {
      responseType: 'blob',
      timeout: 30000,
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plantilla_BulkImport_Usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error('Error al descargar la plantilla Excel');
  }
};

/**
 * Descarga la plantilla CSV para bulk import
 */
export const descargarPlantillaCsv = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(BULK_IMPORT_ENDPOINTS.TEMPLATE_CSV, {
      responseType: 'blob',
      timeout: 30000,
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plantilla_BulkImport_Usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error('Error al descargar la plantilla CSV');
  }
};

/**
 * Obtiene las columnas esperadas para el bulk import
 */
export const obtenerColumnasEsperadas = async (): Promise<ColumnInfo> => {
  try {
    const response = await axiosInstance.get<ColumnInfo>(BULK_IMPORT_ENDPOINTS.COLUMNS);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener las columnas esperadas');
  }
};

// ============================================================================
// UTILIDADES DE PROCESAMIENTO LOCAL
// ============================================================================

/**
 * Procesa un archivo localmente (para preview antes del envío)
 * Requiere bibliotecas como xlsx.js o papaparse
 */
export const procesarArchivoLocal = async (archivo: File): Promise<{
  usuarios: BulkImportUsuario[];
  metadata: Partial<BulkImportMetadata>;
  errores: string[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const extension = archivo.name.split('.').pop()?.toLowerCase();
        let usuarios: BulkImportUsuario[] = [];
        let errores: string[] = [];

        if (extension === 'csv') {
          // TODO: Implementar procesamiento CSV con papaparse
          const content = e.target?.result as string;
          const lines = content.split('\n');
          
          if (lines.length < 2) {
            errores.push('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos');
          } else {
            // Procesamiento básico CSV (se puede mejorar con papaparse)
            const headers = lines[0].split(',').map(h => h.trim());
            
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                
                if (values.length >= headers.length) {
                  usuarios.push({
                    numeroFila: i + 1,
                    nombres: values[0] || '',
                    apellidoPaterno: values[1] || '',
                    apellidoMaterno: values[2] || '',
                    dni: values[3] || '',
                    email: values[4] || '',
                    codigoDepartamento: values[5] || '',
                    dniJefe: values[6] || '',
                    fechaIngreso: values[7] || '',
                    extranjero: values[8] || 'NO',
                    empresa: values[9] || '',
                    roles: values[10] || ''
                  });
                }
              }
            }
          }
        } else if (extension === 'xlsx') {
          // TODO: Implementar procesamiento Excel con xlsx.js
          errores.push('El procesamiento local de archivos Excel requiere la biblioteca xlsx.js');
        } else {
          errores.push('Formato de archivo no soportado para procesamiento local');
        }

        const metadata: Partial<BulkImportMetadata> = {
          nombreArchivo: archivo.name,
          tipoArchivo: extension === 'csv' ? 'CSV' : 'Excel',
          tamanoArchivo: archivo.size,
          totalFilas: usuarios.length,
          filasConDatos: usuarios.filter(u => u.nombres || u.dni).length,
          filasOmitidas: usuarios.length - usuarios.filter(u => u.nombres || u.dni).length,
          erroresParsing: errores
        };

        resolve({ usuarios, metadata, errores });
      } catch (error) {
        reject(new Error('Error al procesar el archivo localmente'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    // Leer como texto para CSV o como ArrayBuffer para Excel
    const extension = archivo.name.split('.').pop()?.toLowerCase();
    if (extension === 'csv') {
      reader.readAsText(archivo, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(archivo);
    }
  });
};

/**
 * Formatea los errores de bulk import para mostrar al usuario
 */
export const formatearErroresBulkImport = (errores: any[]): string[] => {
  return errores.map(error => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.mensaje) {
      return `Fila ${error.numeroFila}: ${error.mensaje}`;
    }
    
    return 'Error desconocido en el procesamiento';
  });
};

/**
 * Calcula estadísticas básicas de un resultado de bulk import
 */
export const calcularEstadisticas = (resultado: BulkImportResult) => {
  const total = resultado.usuariosCreados.length + resultado.registrosFallidos.length;
  const exitosos = resultado.usuariosCreados.length;
  const fallidos = resultado.registrosFallidos.length;
  const tasaExito = total > 0 ? (exitosos / total) * 100 : 0;

  return {
    total,
    exitosos,
    fallidos,
    tasaExito: Math.round(tasaExito * 100) / 100,
    tiempoProcesamiento: resultado.estadisticas.tiempoProcesamiento,
    erroresCriticos: resultado.registrosFallidos.filter(e => e.esCritico).length
  };
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

const bulkImportService = {
  // Validación de archivos
  validarArchivo,
  crearConfiguracionPorDefecto,
  
  // Servicios API
  procesarBulkImport,
  validarBulkImport,
  descargarPlantillaExcel,
  descargarPlantillaCsv,
  obtenerColumnasEsperadas,
  
  // Procesamiento local
  procesarArchivoLocal,
  formatearErroresBulkImport,
  calcularEstadisticas,
  
  // Configuración
  ARCHIVO_CONFIG
};

export default bulkImportService;

import { useState, useCallback, useRef } from 'react';
import type {
  BulkImportResult,
  BulkImportValidationResult,
  BulkImportConfiguracion,
  ArchivoInfo,
  EstadoBulkImport,
  ColumnInfo
} from '../types/bulkImport';
import bulkImportService from '../services/bulkImport.service';

// ============================================================================
// HOOK PRINCIPAL: useBulkImport
// ============================================================================

export const useBulkImport = () => {
  const [estado, setEstado] = useState<EstadoBulkImport>('idle');
  const [archivo, setArchivo] = useState<ArchivoInfo | null>(null);
  const [configuracion, setConfiguracion] = useState<BulkImportConfiguracion>(
    bulkImportService.crearConfiguracionPorDefecto()
  );
  const [validacionResult, setValidacionResult] = useState<BulkImportValidationResult | null>(null);
  const [processingResult, setProcessingResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Limpiar estado
  const resetear = useCallback(() => {
    setEstado('idle');
    setArchivo(null);
    setValidacionResult(null);
    setProcessingResult(null);
    setError(null);
    setProgreso(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Seleccionar archivo
  const seleccionarArchivo = useCallback((file: File) => {
    resetear();
    const archivoInfo = bulkImportService.validarArchivo(file);
    setArchivo(archivoInfo);
    
    if (!archivoInfo.esValido) {
      setError(archivoInfo.errores.join(', '));
      setEstado('error');
    } else {
      setEstado('archivo-seleccionado');
    }
  }, [resetear]);

  // Validar archivo
  const validarArchivo = useCallback(async () => {
    if (!archivo?.archivo || !archivo.esValido) {
      setError('No hay archivo válido seleccionado');
      return;
    }

    try {
      setEstado('validando');
      setError(null);
      setProgreso(0);

      abortControllerRef.current = new AbortController();
      
      const resultado = await bulkImportService.validarBulkImport(archivo.archivo);
      
      setValidacionResult(resultado);
      setProgreso(100);
      
      if (resultado.esValido) {
        setEstado('validado');
      } else {
        setEstado('validacion-fallida');
        setError('El archivo contiene errores de validación');
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar archivo');
      setEstado('error');
      setProgreso(0);
    }
  }, [archivo]);

  // Procesar archivo
  const procesarArchivo = useCallback(async () => {
    if (!archivo?.archivo || !archivo.esValido) {
      setError('No hay archivo válido seleccionado');
      return;
    }

    try {
      setEstado('procesando');
      setError(null);
      setProgreso(0);

      abortControllerRef.current = new AbortController();

      const resultado = await bulkImportService.procesarBulkImport(
        archivo.archivo,
        configuracion
      );

      setProcessingResult(resultado);
      setProgreso(100);
      setEstado('completado');
    } catch (err: any) {
      setError(err.message || 'Error al procesar archivo');
      setEstado('error');
      setProgreso(0);
    }
  }, [archivo, configuracion]);

  // Cancelar operación
  const cancelar = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setEstado('cancelado');
    setProgreso(0);
  }, []);

  // Actualizar configuración
  const actualizarConfiguracion = useCallback((nuevaConfig: Partial<BulkImportConfiguracion>) => {
    setConfiguracion(prev => ({ ...prev, ...nuevaConfig }));
  }, []);

  return {
    // Estado
    estado,
    archivo,
    configuracion,
    validacionResult,
    processingResult,
    error,
    progreso,
    
    // Acciones
    seleccionarArchivo,
    validarArchivo,
    procesarArchivo,
    cancelar,
    resetear,
    actualizarConfiguracion,
    
    // Utilidades
    puedeValidar: estado === 'archivo-seleccionado',
    puedeProcesar: estado === 'validado' || estado === 'validacion-fallida',
    estaEnProceso: estado === 'validando' || estado === 'procesando',
    tieneResultados: estado === 'completado' && processingResult !== null
  };
};

// ============================================================================
// HOOK PARA PLANTILLAS: usePlantillasBulkImport
// ============================================================================

export const usePlantillasBulkImport = () => {
  const [descargando, setDescargando] = useState<'excel' | 'csv' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [columnasInfo, setColumnasInfo] = useState<ColumnInfo | null>(null);

  const descargarPlantillaExcel = useCallback(async () => {
    try {
      setDescargando('excel');
      setError(null);
      await bulkImportService.descargarPlantillaExcel();
    } catch (err: any) {
      setError(err.message || 'Error al descargar plantilla Excel');
    } finally {
      setDescargando(null);
    }
  }, []);

  const descargarPlantillaCsv = useCallback(async () => {
    try {
      setDescargando('csv');
      setError(null);
      await bulkImportService.descargarPlantillaCsv();
    } catch (err: any) {
      setError(err.message || 'Error al descargar plantilla CSV');
    } finally {
      setDescargando(null);
    }
  }, []);

  const obtenerColumnas = useCallback(async () => {
    try {
      setError(null);
      const columnas = await bulkImportService.obtenerColumnasEsperadas();
      setColumnasInfo(columnas);
    } catch (err: any) {
      setError(err.message || 'Error al obtener información de columnas');
    }
  }, []);

  return {
    descargando,
    error,
    columnasInfo,
    descargarPlantillaExcel,
    descargarPlantillaCsv,
    obtenerColumnas
  };
};

// ============================================================================
// HOOK PARA PREVIEW LOCAL: usePreviewBulkImport
// ============================================================================

export const usePreviewBulkImport = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    usuarios: any[];
    metadata: any;
    errores: string[];
  } | null>(null);

  const generarPreview = useCallback(async (archivo: File) => {
    try {
      setCargando(true);
      setError(null);
      
      const resultado = await bulkImportService.procesarArchivoLocal(archivo);
      setPreview(resultado);
    } catch (err: any) {
      setError(err.message || 'Error al generar preview');
      setPreview(null);
    } finally {
      setCargando(false);
    }
  }, []);

  const limpiarPreview = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  return {
    cargando,
    error,
    preview,
    generarPreview,
    limpiarPreview
  };
};

// ============================================================================
// HOOK PARA ESTADÍSTICAS: useEstadisticasBulkImport
// ============================================================================

export const useEstadisticasBulkImport = (resultado: BulkImportResult | null) => {
  const estadisticas = resultado ? bulkImportService.calcularEstadisticas(resultado) : null;

  const obtenerResumenResultados = useCallback(() => {
    if (!resultado || !estadisticas) return null;

    return {
      total: estadisticas.total,
      exitosos: estadisticas.exitosos,
      fallidos: estadisticas.fallidos,
      tasaExito: estadisticas.tasaExito,
      tiempoProcesamiento: estadisticas.tiempoProcesamiento,
      
      // Clasificación de errores
      erroresCriticos: estadisticas.erroresCriticos,
      erroresLeves: estadisticas.fallidos - estadisticas.erroresCriticos,
      
      // Categorías de usuarios creados
      usuariosConJefe: resultado.usuariosCreados.filter(u => u.dniJefe).length,
      usuariosSinJefe: resultado.usuariosCreados.filter(u => !u.dniJefe).length,
      
      // Top errores
      tiposErrorMasComunes: resultado.registrosFallidos
        .reduce((acc, error) => {
          const tipo = error.mensaje.split(':')[0] || 'Error general';
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };
  }, [resultado, estadisticas]);

  return {
    estadisticas,
    resumen: obtenerResumenResultados()
  };
};

// ============================================================================
// HOOK UTILITARIO: useArchivoValidator
// ============================================================================

export const useArchivoValidator = () => {
  const validarTamaño = useCallback((archivo: File, maxSizeMB: number = 10): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return archivo.size <= maxBytes;
  }, []);

  const validarExtension = useCallback((archivo: File): boolean => {
    const extension = archivo.name.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls', 'csv'].includes(extension || '');
  }, []);

  const validarTipoMime = useCallback((archivo: File): boolean => {
    const tiposPermitidos = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv'
    ];
    return tiposPermitidos.includes(archivo.type);
  }, []);

  const validacionCompleta = useCallback((archivo: File) => {
    const errores: string[] = [];

    if (!validarExtension(archivo)) {
      errores.push('Extensión de archivo no válida. Use .xlsx, .xls o .csv');
    }

    if (!validarTamaño(archivo)) {
      errores.push('El archivo excede el tamaño máximo de 10 MB');
    }

    if (archivo.type && !validarTipoMime(archivo)) {
      errores.push('Tipo MIME no válido');
    }

    if (archivo.size === 0) {
      errores.push('El archivo está vacío');
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }, [validarExtension, validarTamaño, validarTipoMime]);

  return {
    validarTamaño,
    validarExtension,
    validarTipoMime,
    validacionCompleta
  };
};

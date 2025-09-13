import { useState, useCallback, useEffect } from 'react';
import auditoriaService from '../services/auditoria.service';
import type {
  AuditoriaSimple,
  AuditoriaSimplePaginada,
  FiltrosAuditoria,
  EstadisticasAuditoria,
  ModuloSistemaType
} from '../types/auditoria';
import { PAGINACION_DEFAULT } from '../utils/auditoria.constants';

// ============================================================================
// INTERFACES PARA EL HOOK
// ============================================================================

export interface UseAuditoriaState {
  // Datos
  registros: AuditoriaSimple[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  
  // Estados de UI
  isLoading: boolean;
  error: string | null;
  
  // Control de paginación
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export interface UseAuditoriaActions {
  // Cargar datos
  cargarHistorial: () => Promise<void>;
  cargarHistorialConFiltros: (filtros: FiltrosAuditoria) => Promise<void>;
  
  // Navegación
  irAPagina: (pagina: number) => Promise<void>;
  paginaAnterior: () => Promise<void>;
  paginaSiguiente: () => Promise<void>;
  
  // Filtros
  aplicarFiltros: (filtros: Partial<FiltrosAuditoria>) => Promise<void>;
  limpiarFiltros: () => Promise<void>;
  
  // Utilidades
  recargar: () => Promise<void>;
  limpiarError: () => void;
}

export interface UseAuditoriaOptions {
  modulo?: ModuloSistemaType;
  usuarioId?: string;
  tamanoPaginaInicial?: number;
  cargarAutomaticamente?: boolean;
  filtrosIniciales?: Partial<FiltrosAuditoria>;
}

export interface UseAuditoriaReturn extends UseAuditoriaState, UseAuditoriaActions {
  filtrosActuales: FiltrosAuditoria;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook para gestionar el historial de auditoría con paginación y filtros
 */
export function useAuditoria(options: UseAuditoriaOptions = {}): UseAuditoriaReturn {
  const {
    modulo,
    usuarioId,
    tamanoPaginaInicial = PAGINACION_DEFAULT.TAMANO_PAGINA_DEFAULT,
    cargarAutomaticamente = true,
    filtrosIniciales = {}
  } = options;

  // ===== ESTADO =====
  const [state, setState] = useState<UseAuditoriaState>({
    registros: [],
    totalRegistros: 0,
    paginaActual: PAGINACION_DEFAULT.PAGINA_INICIAL,
    totalPaginas: 0,
    isLoading: false,
    error: null,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false
  });

  const [filtros, setFiltros] = useState<FiltrosAuditoria>({
    pagina: PAGINACION_DEFAULT.PAGINA_INICIAL,
    tamanoPagina: tamanoPaginaInicial,
    modulo,
    usuarioId,
    ...filtrosIniciales
  });

  // ===== FUNCIONES INTERNAS =====

  const actualizarEstado = useCallback((nuevaData: AuditoriaSimplePaginada) => {
    setState(prevState => ({
      ...prevState,
      registros: nuevaData.registros,
      totalRegistros: nuevaData.totalRegistros,
      paginaActual: nuevaData.paginaActual,
      totalPaginas: nuevaData.totalPaginas,
      tienePaginaAnterior: nuevaData.tienePaginaAnterior,
      tienePaginaSiguiente: nuevaData.tienePaginaSiguiente,
      isLoading: false,
      error: null
    }));
  }, []);

  const manejarError = useCallback((error: any) => {
    console.error('Error en useAuditoria:', error);
    setState(prevState => ({
      ...prevState,
      isLoading: false,
      error: error.message || 'Error al cargar los datos de auditoría'
    }));
  }, []);

  // ===== ACCIONES PRINCIPALES =====

  const cargarHistorial = useCallback(async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      let resultado: AuditoriaSimplePaginada;
      
      // Verificar si hay filtros específicos que requieren el endpoint general
      const tieneRecursosFiltrosEspecificos = 
        filtros.tablaAfectada || 
        filtros.tipoAccion || 
        filtros.severidad || 
        filtros.fechaDesde || 
        filtros.fechaHasta ||
        filtros.ordenarPor ||
        filtros.ordenDescendente !== undefined;

      if (modulo === 'GESTION_USUARIOS' && !tieneRecursosFiltrosEspecificos) {
        // Solo usar el endpoint optimizado para GESTION_USUARIOS sin filtros específicos
        resultado = await auditoriaService.obtenerHistorialGestionUsuariosSimple(
          filtros.pagina || 1,
          filtros.tamanoPagina || tamanoPaginaInicial,
          filtros.usuarioId
        );
      } else {
        // Usar endpoint general para todos los demás casos
        const resultadoCompleto = await auditoriaService.obtenerHistorial(filtros);
        // Convertir a formato simple
        resultado = {
          registros: resultadoCompleto.registros.map(r => ({
            id: r.id,
            accion: r.mensajeCorto,
            usuarioEjecutor: r.usuarioEjecutorNombre || 'Usuario desconocido',
            usuarioAfectado: r.usuarioAfectadoNombre,
            mensajeCorto: r.mensajeCorto,
            motivo: r.motivo,
            fechaHora: r.fechaHora,
            severidad: r.severidad.toString(),
            ipAddress: r.ipAddress
          })),
          totalRegistros: resultadoCompleto.totalRegistros,
          paginaActual: resultadoCompleto.paginaActual,
          totalPaginas: resultadoCompleto.totalPaginas,
          tienePaginaAnterior: resultadoCompleto.tienePaginaAnterior,
          tienePaginaSiguiente: resultadoCompleto.tienePaginaSiguiente
        };
      }
      
      actualizarEstado(resultado);
    } catch (error) {
      manejarError(error);
    }
  }, [filtros, modulo, tamanoPaginaInicial, actualizarEstado, manejarError]);

  const cargarHistorialConFiltros = useCallback(async (nuevosFiltros: FiltrosAuditoria) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      let resultado: AuditoriaSimplePaginada;
      
      // Verificar si hay filtros específicos que requieren el endpoint general
      const tieneRecursosFiltrosEspecificos = 
        nuevosFiltros.tablaAfectada || 
        nuevosFiltros.tipoAccion || 
        nuevosFiltros.severidad || 
        nuevosFiltros.fechaDesde || 
        nuevosFiltros.fechaHasta ||
        nuevosFiltros.ordenarPor ||
        nuevosFiltros.ordenDescendente !== undefined;

      if (modulo === 'GESTION_USUARIOS' && !tieneRecursosFiltrosEspecificos) {
        // Solo usar el endpoint optimizado para GESTION_USUARIOS sin filtros específicos
        resultado = await auditoriaService.obtenerHistorialGestionUsuariosSimple(
          nuevosFiltros.pagina || 1,
          nuevosFiltros.tamanoPagina || tamanoPaginaInicial,
          nuevosFiltros.usuarioId
        );
      } else {
        // Usar endpoint general para todos los demás casos
        const resultadoCompleto = await auditoriaService.obtenerHistorial(nuevosFiltros);
        // Convertir a formato simple
        resultado = {
          registros: resultadoCompleto.registros.map(r => ({
            id: r.id,
            accion: r.mensajeCorto,
            usuarioEjecutor: r.usuarioEjecutorNombre || 'Usuario desconocido',
            usuarioAfectado: r.usuarioAfectadoNombre,
            mensajeCorto: r.mensajeCorto,
            motivo: r.motivo,
            fechaHora: r.fechaHora,
            severidad: r.severidad.toString(),
            ipAddress: r.ipAddress
          })),
          totalRegistros: resultadoCompleto.totalRegistros,
          paginaActual: resultadoCompleto.paginaActual,
          totalPaginas: resultadoCompleto.totalPaginas,
          tienePaginaAnterior: resultadoCompleto.tienePaginaAnterior,
          tienePaginaSiguiente: resultadoCompleto.tienePaginaSiguiente
        };
      }
      
      actualizarEstado(resultado);
    } catch (error) {
      manejarError(error);
    }
  }, [modulo, tamanoPaginaInicial, actualizarEstado, manejarError]);

  // ===== NAVEGACIÓN =====

  const irAPagina = useCallback(async (pagina: number) => {
    if (pagina < 1 || pagina > state.totalPaginas || pagina === state.paginaActual) {
      return;
    }
    
    const nuevosFiltros = { ...filtros, pagina };
    setFiltros(nuevosFiltros);
    await cargarHistorialConFiltros(nuevosFiltros);
  }, [filtros, state.totalPaginas, state.paginaActual, cargarHistorialConFiltros]);

  const paginaAnterior = useCallback(async () => {
    if (state.tienePaginaAnterior) {
      await irAPagina(state.paginaActual - 1);
    }
  }, [state.tienePaginaAnterior, state.paginaActual, irAPagina]);

  const paginaSiguiente = useCallback(async () => {
    if (state.tienePaginaSiguiente) {
      await irAPagina(state.paginaActual + 1);
    }
  }, [state.tienePaginaSiguiente, state.paginaActual, irAPagina]);

  // ===== FILTROS =====

  const aplicarFiltros = useCallback(async (nuevosFiltros: Partial<FiltrosAuditoria>) => {
    const filtrosActualizados = {
      ...filtros,
      ...nuevosFiltros,
      pagina: 1 // Resetear a la primera página cuando se aplican filtros
    };
    
    setFiltros(filtrosActualizados);
    await cargarHistorialConFiltros(filtrosActualizados);
  }, [filtros, cargarHistorialConFiltros]);

  const limpiarFiltros = useCallback(async () => {
    const filtrosLimpios: FiltrosAuditoria = {
      pagina: PAGINACION_DEFAULT.PAGINA_INICIAL,
      tamanoPagina: tamanoPaginaInicial,
      modulo,
      usuarioId
    };
    
    setFiltros(filtrosLimpios);
    await cargarHistorialConFiltros(filtrosLimpios);
  }, [tamanoPaginaInicial, modulo, usuarioId, cargarHistorialConFiltros]);

  // ===== UTILIDADES =====

  const recargar = useCallback(async () => {
    await cargarHistorial();
  }, [cargarHistorial]);

  const limpiarError = useCallback(() => {
    setState(prevState => ({ ...prevState, error: null }));
  }, []);

  // ===== EFECTOS =====

  useEffect(() => {
    if (cargarAutomaticamente) {
      cargarHistorial();
    }
  }, []); // Solo al montar el componente

  // ===== RETURN =====

  return {
    // Estado
    registros: state.registros,
    totalRegistros: state.totalRegistros,
    paginaActual: state.paginaActual,
    totalPaginas: state.totalPaginas,
    isLoading: state.isLoading,
    error: state.error,
    tienePaginaAnterior: state.tienePaginaAnterior,
    tienePaginaSiguiente: state.tienePaginaSiguiente,
    
    // Filtros actuales
    filtrosActuales: filtros,
    
    // Acciones
    cargarHistorial,
    cargarHistorialConFiltros,
    irAPagina,
    paginaAnterior,
    paginaSiguiente,
    aplicarFiltros,
    limpiarFiltros,
    recargar,
    limpiarError
  };
}

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook específico para auditoría de gestión de usuarios
 */
export function useAuditoriaGestionUsuarios(usuarioId?: string) {
  return useAuditoria({
    modulo: 'GESTION_USUARIOS' as ModuloSistemaType,
    usuarioId,
    tamanoPaginaInicial: PAGINACION_DEFAULT.TAMANO_PAGINA_DEFAULT,
    cargarAutomaticamente: true
  });
}

/**
 * Hook específico para auditoría de solicitudes de vacaciones
 */
export function useAuditoriaSolicitudesVacaciones(solicitudId?: string) {
  return useAuditoria({
    modulo: 'SOLICITUDES_VACACIONES' as ModuloSistemaType,
    usuarioId: solicitudId, // Reutilizamos el parámetro usuarioId como filtro genérico
    tamanoPaginaInicial: PAGINACION_DEFAULT.TAMANO_PAGINA_DEFAULT,
    cargarAutomaticamente: true
  });
}

/**
 * Hook específico para auditoría de configuración del sistema
 */
export function useAuditoriaConfiguracion() {
  return useAuditoria({
    modulo: 'CONFIGURACION' as ModuloSistemaType,
    tamanoPaginaInicial: PAGINACION_DEFAULT.TAMANO_PAGINA_DEFAULT,
    cargarAutomaticamente: true
  });
}

/**
 * Hook específico para auditoría de reportes
 */
export function useAuditoriaReportes(reporteId?: string) {
  return useAuditoria({
    modulo: 'REPORTES' as ModuloSistemaType,
    usuarioId: reporteId, // Reutilizamos el parámetro usuarioId como filtro genérico
    tamanoPaginaInicial: PAGINACION_DEFAULT.TAMANO_PAGINA_DEFAULT,
    cargarAutomaticamente: true
  });
}

/**
 * Hook para obtener estadísticas de auditoría
 */
export function useEstadisticasAuditoria(fechaDesde?: Date, fechaHasta?: Date) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasAuditoria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEstadisticas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const resultado = await auditoriaService.obtenerEstadisticas(fechaDesde, fechaHasta);
      setEstadisticas(resultado);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error en useEstadisticasAuditoria:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return {
    estadisticas,
    isLoading,
    error,
    recargar: cargarEstadisticas
  };
}

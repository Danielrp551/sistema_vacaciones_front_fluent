// ============================================================================
// CUSTOM HOOK PARA TAB DE AUDITORÍA DE ROLES
// ============================================================================
// Este hook maneja la funcionalidad del tab de auditoría específico para
// la página de gestión de roles, siguiendo el patrón de otras vistas
// ============================================================================

import { useState, useCallback } from 'react';
import type { 
  FiltrosAuditoria, 
  AuditoriaCompleta, 
  AuditoriaCompletaPaginada 
} from '../types/auditoria';
import auditoriaService from '../services/auditoria.service';

interface AuditoriaTabState {
  auditorias: AuditoriaCompleta[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useAuditoriaRoles = () => {
  const [state, setState] = useState<AuditoriaTabState>({
    auditorias: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [filtros, setFiltros] = useState<FiltrosAuditoria>({
    pagina: 1,
    tamanoPagina: 10,
    modulo: 'GESTION_ROLES', // Cambio: usar GESTION_ROLES en lugar de ADMINISTRACION
    tablaAfectada: 'AspNetRoles', // Cambio: usar AspNetRoles para coincidir con el backend
    ordenarPor: 'fechaHora',
    ordenDescendente: true
  });

  // Función para cargar auditorías
  const loadAuditorias = useCallback(async (newFiltros?: Partial<FiltrosAuditoria>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const finalFiltros = { 
        ...filtros, 
        ...newFiltros, 
        modulo: 'ADMINISTRACION' as const,
        tablaAfectada: 'Rol'
      };
      const response: AuditoriaCompletaPaginada = await auditoriaService.obtenerHistorial(finalFiltros);
      
      setState(prev => ({
        ...prev,
        auditorias: response.registros,
        totalCount: response.totalRegistros,
        currentPage: response.paginaActual,
        pageSize: response.tamanoPagina,
        hasNextPage: response.tienePaginaSiguiente,
        hasPreviousPage: response.tienePaginaAnterior,
        loading: false
      }));
      
      setFiltros(finalFiltros);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar auditorías'
      }));
    }
  }, [filtros]);

  // Función para cambiar página
  const changePage = useCallback((page: number) => {
    loadAuditorias({ pagina: page });
  }, [loadAuditorias]);

  // Función para cambiar tamaño de página
  const changePageSize = useCallback((size: number) => {
    loadAuditorias({ pagina: 1, tamanoPagina: size });
  }, [loadAuditorias]);

  // Función para aplicar filtros
  const applyFilters = useCallback((newFiltros: Partial<FiltrosAuditoria>) => {
    loadAuditorias({ pagina: 1, ...newFiltros });
  }, [loadAuditorias]);

  return {
    ...state,
    filtros,
    loadAuditorias,
    changePage,
    changePageSize,
    applyFilters,
    refresh: () => loadAuditorias()
  };
};

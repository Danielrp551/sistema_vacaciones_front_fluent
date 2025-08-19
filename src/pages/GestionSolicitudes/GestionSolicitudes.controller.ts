import { useState, useEffect, useCallback } from 'react';
import { 
  GestionSolicitudesService, 
  type GestionSolicitudesQueryObject,
  type EmpleadoDto
} from '../../services/gestionSolicitudes.service';
import type { SolicitudVacacionesDetailDto } from '../../services/solicitudVacaciones.service';
import { mapColumnToField } from '../../utils/sortUtils';

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

interface UseGestionSolicitudesControllerReturn {
  // Estado de datos
  solicitudes: SolicitudVacacionesDetailDto[];
  totalSolicitudes: number;  // Total de la página actual
  totalCompleto: number;     // Total completo para paginación
  empleados: EmpleadoDto[];
  
  // Estado de UI
  isLoading: boolean;
  isProcessing: boolean;
  error: string;
  successMessage: string;
  
  // Filtros y paginación
  currentPage: number;
  pageSize: number;
  filters: GestionSolicitudesQueryObject;
  
  // Ordenamiento
  sortConfig: SortConfig | null;
  
  // Estadísticas
  stats: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    canceladas: number;
  };
  
  // Acciones
  loadSolicitudes: () => Promise<void>;
  loadEmpleados: () => Promise<void>;
  aprobarSolicitud: (solicitudId: string, comentarios?: string) => Promise<void>;
  rechazarSolicitud: (solicitudId: string, comentarios: string) => Promise<void>;
  applyFilters: (newFilters: Partial<GestionSolicitudesQueryObject>) => void;
  changePage: (page: number) => void;
  changePageSize: (newPageSize: number) => void;
  handleSort: (columnKey: string, isSortedDescending?: boolean) => void;
  clearError: () => void;
  clearSuccess: () => void;
  refreshData: () => void;
}

export const useGestionSolicitudesController = (): UseGestionSolicitudesControllerReturn => {
  // Estado de datos
  const [solicitudes, setSolicitudes] = useState<SolicitudVacacionesDetailDto[]>([]);
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [totalCompleto, setTotalCompleto] = useState(0);
  const [empleados, setEmpleados] = useState<EmpleadoDto[]>([]);
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filtros y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<GestionSolicitudesQueryObject>({
    pageNumber: 1,
    pageSize: 10,
    incluirSubordinadosNivelN: false,
  });
  
  // Ordenamiento
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    canceladas: 0,
  });

  // Cargar solicitudes del equipo
  const loadSolicitudes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Mapear el campo de ordenamiento si existe
      const sortBy = sortConfig ? mapColumnToField(sortConfig.key) : undefined;
      const isDescending = sortConfig?.direction === 'descending';
      
      const response = await GestionSolicitudesService.getSolicitudesEquipo({
        ...filters,
        pageNumber: currentPage,
        pageSize: pageSize,
        sortBy,
        isDescending,
      });

      setSolicitudes(response.solicitudes);
      setTotalSolicitudes(response.total);
      setTotalCompleto(response.totalCompleto);
      setStats(response.estadisticas);

    } catch (err) {
      console.error('Error al cargar solicitudes del equipo:', err);
      setError('Error al cargar las solicitudes del equipo. Por favor, intenta nuevamente.');
      setSolicitudes([]);
      setTotalSolicitudes(0);
      setTotalCompleto(0);
      setStats({
        total: 0,
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        canceladas: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize, sortConfig]);

  // Cargar empleados del equipo
  const loadEmpleados = useCallback(async () => {
    try {
      const response = await GestionSolicitudesService.getEmpleadosEquipo(
        filters.incluirSubordinadosNivelN || false
      );
      setEmpleados(response.empleados);
    } catch (err) {
      console.error('Error al cargar empleados del equipo:', err);
      setError('Error al cargar los empleados del equipo.');
      setEmpleados([]);
    }
  }, [filters.incluirSubordinadosNivelN]);

  // Aprobar solicitud
  const aprobarSolicitud = useCallback(async (solicitudId: string, comentarios?: string) => {
    try {
      setIsProcessing(true);
      setError('');

      await GestionSolicitudesService.aprobarSolicitud(solicitudId, comentarios);
      
      setSuccessMessage('Solicitud aprobada exitosamente');
      await loadSolicitudes(); // Recargar la lista

    } catch (err) {
      console.error('Error al aprobar solicitud:', err);
      setError('Error al aprobar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  }, [loadSolicitudes]);

  // Rechazar solicitud
  const rechazarSolicitud = useCallback(async (solicitudId: string, comentarios: string) => {
    try {
      setIsProcessing(true);
      setError('');

      await GestionSolicitudesService.rechazarSolicitud(solicitudId, comentarios);
      
      setSuccessMessage('Solicitud rechazada exitosamente');
      await loadSolicitudes(); // Recargar la lista

    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
      setError('Error al rechazar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  }, [loadSolicitudes]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: Partial<GestionSolicitudesQueryObject>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset a la primera página cuando se aplican filtros
  }, []);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Cambiar tamaño de página
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reiniciar a la primera página
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Limpiar mensaje de éxito
  const clearSuccess = useCallback(() => {
    setSuccessMessage('');
  }, []);

  // Refrescar datos
  const refreshData = useCallback(() => {
    loadSolicitudes();
    loadEmpleados();
  }, [loadSolicitudes, loadEmpleados]);

  // Manejar ordenamiento de columnas
  const handleSort = useCallback((columnKey: string, isSortedDescending?: boolean) => {
    const direction = isSortedDescending ? 'descending' : 'ascending';
    setSortConfig({ key: columnKey, direction });
    
    // Reset a la primera página cuando se cambia el ordenamiento
    setCurrentPage(1);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  useEffect(() => {
    loadEmpleados();
  }, [loadEmpleados]);

  return {
    // Estado de datos
    solicitudes,
    totalSolicitudes,
    totalCompleto,
    empleados,
    
    // Estado de UI
    isLoading,
    isProcessing,
    error,
    successMessage,
    
    // Filtros y paginación
    currentPage,
    pageSize,
    filters,
    
    // Ordenamiento
    sortConfig,
    
    // Estadísticas
    stats,
    
    // Acciones
    loadSolicitudes,
    loadEmpleados,
    aprobarSolicitud,
    rechazarSolicitud,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    refreshData,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { 
  GestionSolicitudesService, 
  type GestionSolicitudesQueryObject,
} from '../../services/gestionSolicitudes.service';
import type { SolicitudVacacionesDetailDto } from '../../services/solicitudVacaciones.service';
import { useDataTable } from '../../components/DataTable';
import type { SortConfig } from '../../components/DataTable';
import { mapColumnToField } from '../../utils/sortUtils';

interface UseDashboardControllerReturn {
  // Estado de datos
  solicitudes: SolicitudVacacionesDetailDto[];
  totalCompleto: number;
  
  // Estado de UI
  isLoading: boolean;
  error: string;
  
  // Filtros y paginación
  currentPage: number;
  pageSize: number;
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
  changePage: (page: number) => void;
  changePageSize: (newPageSize: number) => void;
  handleSort: (columnKey: string, isSortedDescending?: boolean) => void;
  refreshData: () => void;
}

export const useDashboardController = (): UseDashboardControllerReturn => {
  // Estado de datos
  const [solicitudes, setSolicitudes] = useState<SolicitudVacacionesDetailDto[]>([]);
  const [totalCompleto, setTotalCompleto] = useState(0);
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    canceladas: 0,
  });

  // Hook de tabla reutilizable
  const {
    currentPage,
    pageSize,
    sortConfig,
    changePage,
    changePageSize,
    handleSort,
  } = useDataTable({
    initialPageSize: 10,
    initialPage: 1,
  });

  // Cargar solicitudes del equipo
  const loadSolicitudes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const filters: GestionSolicitudesQueryObject = {
        pageNumber: currentPage,
        pageSize: pageSize,
        incluirSubordinadosNivelN: false,
        // Agregar parámetros de ordenamiento
        sortBy: sortConfig ? mapColumnToField(sortConfig.key) : undefined,
        isDescending: sortConfig ? sortConfig.direction === 'descending' : undefined,
      };

      // Debug logging
      if (sortConfig) {
        console.log('[DEBUG] Frontend - sortConfig:', sortConfig);
        console.log('[DEBUG] Frontend - mapColumnToField result:', mapColumnToField(sortConfig.key));
        console.log('[DEBUG] Frontend - filters enviado:', filters);
      }
      
      const response = await GestionSolicitudesService.getSolicitudesEquipo(filters);
      
      setSolicitudes(response.solicitudes || []);
      setTotalCompleto(response.totalCompleto || 0);
      
      // Usar estadísticas del backend si están disponibles, sino calcular
      if (response.estadisticas) {
        setStats(response.estadisticas);
      } else {
        // Calcular estadísticas localmente
        const newStats = {
          total: response.totalCompleto || 0,
          pendientes: response.solicitudes?.filter((s: SolicitudVacacionesDetailDto) => s.estado === 'Pendiente').length || 0,
          aprobadas: response.solicitudes?.filter((s: SolicitudVacacionesDetailDto) => s.estado === 'Aprobada').length || 0,
          rechazadas: response.solicitudes?.filter((s: SolicitudVacacionesDetailDto) => s.estado === 'Rechazada').length || 0,
          canceladas: response.solicitudes?.filter((s: SolicitudVacacionesDetailDto) => s.estado === 'Cancelada').length || 0,
        };
        setStats(newStats);
      }
    } catch (err) {
      console.error('Error loading solicitudes:', err);
      setError('Error de conexión al cargar las solicitudes');
      setSolicitudes([]);
      setTotalCompleto(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortConfig]);

  // Efectos
  useEffect(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  const refreshData = useCallback(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  return {
    solicitudes,
    totalCompleto,
    isLoading,
    error,
    currentPage,
    pageSize,
    sortConfig,
    stats,
    changePage,
    changePageSize,
    handleSort,
    refreshData,
  };
};

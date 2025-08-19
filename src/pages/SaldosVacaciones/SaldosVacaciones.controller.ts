import { useState, useEffect, useCallback } from 'react';
import { 
  SaldosVacacionesService, 
  type SaldosVacacionesQueryObject,
  type SaldoVacacionesDto,
  type EmpleadoDto
} from '../../services/saldosVacaciones.service';
import { mapColumnToField } from '../../utils/sortUtils';

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

interface UseSaldosVacacionesControllerReturn {
  // Estado de datos
  saldos: SaldoVacacionesDto[];
  totalSaldos: number;  // Total de la página actual
  totalCompleto: number;     // Total completo para paginación
  empleados: EmpleadoDto[];
  
  // Estado de UI
  isLoading: boolean;
  error: string;
  successMessage: string;
  
  // Filtros y paginación
  currentPage: number;
  pageSize: number;
  filters: SaldosVacacionesQueryObject;
  
  // Ordenamiento
  sortConfig: SortConfig | null;
  
  // Estadísticas
  stats: {
    totalEmpleados: number;
    totalDiasVencidas: number;
    totalDiasPendientes: number;
    totalDiasTruncas: number;
    totalDiasLibres: number;
    totalDiasBloque: number;
  };
  
  // Acciones
  loadSaldos: () => Promise<void>;
  loadEmpleados: () => Promise<void>;
  applyFilters: (newFilters: Partial<SaldosVacacionesQueryObject>) => void;
  changePage: (page: number) => void;
  changePageSize: (newPageSize: number) => void;
  handleSort: (columnKey: string, isSortedDescending?: boolean) => void;
  clearError: () => void;
  clearSuccess: () => void;
  refreshData: () => void;
}

export const useSaldosVacacionesController = (): UseSaldosVacacionesControllerReturn => {
  // Estado de datos
  const [saldos, setSaldos] = useState<SaldoVacacionesDto[]>([]);
  const [totalSaldos, setTotalSaldos] = useState(0);
  const [totalCompleto, setTotalCompleto] = useState(0);
  const [empleados, setEmpleados] = useState<EmpleadoDto[]>([]);
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filtros y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<SaldosVacacionesQueryObject>({
    pageNumber: 1,
    pageSize: 10,
    incluirSubordinadosNivelN: false,
  });
  
  // Ordenamiento
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // Estadísticas
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    totalDiasVencidas: 0,
    totalDiasPendientes: 0,
    totalDiasTruncas: 0,
    totalDiasLibres: 0,
    totalDiasBloque: 0,
  });

  // Cargar saldos de vacaciones
  const loadSaldos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Mapear el campo de ordenamiento si existe
      const sortBy = sortConfig ? mapColumnToField(sortConfig.key) : undefined;
      const isDescending = sortConfig?.direction === 'descending';
      
      const response = await SaldosVacacionesService.getSaldosVacaciones({
        ...filters,
        pageNumber: currentPage,
        pageSize: pageSize,
        sortBy,
        isDescending,
      });

      setSaldos(response.saldos);
      setTotalSaldos(response.total);
      setTotalCompleto(response.totalCompleto);
      setStats(response.estadisticas);

    } catch (err) {
      console.error('Error al cargar saldos de vacaciones:', err);
      setError('Error al cargar los saldos de vacaciones. Por favor, intenta nuevamente.');
      setSaldos([]);
      setTotalSaldos(0);
      setTotalCompleto(0);
      setStats({
        totalEmpleados: 0,
        totalDiasVencidas: 0,
        totalDiasPendientes: 0,
        totalDiasTruncas: 0,
        totalDiasLibres: 0,
        totalDiasBloque: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize, sortConfig]);

  // Cargar empleados del equipo
  const loadEmpleados = useCallback(async () => {
    try {
      const response = await SaldosVacacionesService.getEmpleadosEquipo(
        filters.incluirSubordinadosNivelN || false
      );
      setEmpleados(response.empleados);
    } catch (err) {
      console.error('Error al cargar empleados del equipo:', err);
      setError('Error al cargar los empleados del equipo.');
      setEmpleados([]);
    }
  }, [filters.incluirSubordinadosNivelN]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: Partial<SaldosVacacionesQueryObject>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      pageNumber: 1, // Reset a primera página al aplicar filtros
    }));
    setCurrentPage(1); // Reset la página actual también
  }, []);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Cambiar tamaño de página
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset a primera página al cambiar tamaño
    setFilters(prev => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
  }, []);

  // Manejar ordenamiento
  const handleSort = useCallback((columnKey: string, isSortedDescending?: boolean) => {
    const direction = isSortedDescending ? 'descending' : 'ascending';
    setSortConfig({ key: columnKey, direction });
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
    loadSaldos();
    loadEmpleados();
  }, [loadSaldos, loadEmpleados]);

  // Efectos
  useEffect(() => {
    loadSaldos();
  }, [loadSaldos]);

  useEffect(() => {
    loadEmpleados();
  }, [loadEmpleados]);

  return {
    // Estado de datos
    saldos,
    totalSaldos,
    totalCompleto,
    empleados,
    
    // Estado de UI
    isLoading,
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
    loadSaldos,
    loadEmpleados,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    refreshData,
  };
};

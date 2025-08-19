import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SolicitudVacacionesService } from '../../services/solicitudVacaciones.service';
import { useDataTable } from '../../components/DataTable';
import type { SortConfig } from '../../components/DataTable';
import { mapColumnToField } from '../../utils/sortUtils';
import type { 
  SolicitudVacacionesDetailDto, 
  SolicitudesQueryObject,
  MisSolicitudesResponse
} from '../../services/solicitudVacaciones.service';
import type { IContextualMenuItem } from '@fluentui/react';

// Constantes para validación de cancelación
const ESTADO_PENDIENTE = 'pendiente';

/**
 * Utilidad para normalizar fechas a medianoche
 * @param date - Fecha a normalizar
 * @returns Nueva instancia de fecha normalizada a medianoche
 */
const normalizeDateToMidnight = (date: Date): Date => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

/**
 * Valida si una solicitud puede ser cancelada
 * Reglas de negocio:
 * 1. La solicitud debe estar en estado 'pendiente'
 * 2. La fecha de inicio debe ser mayor que la fecha actual (no incluye hoy)
 * 
 * @param solicitud - Solicitud a validar
 * @returns true si la solicitud puede ser cancelada, false en caso contrario
 */
const validateCanCancelSolicitud = (solicitud: SolicitudVacacionesDetailDto): boolean => {
  // Validar estado pendiente
  if (solicitud.estado !== ESTADO_PENDIENTE) return false;
  
  // Validar fecha de inicio mayor que hoy
  const fechaHoy = normalizeDateToMidnight(new Date());
  const fechaInicio = normalizeDateToMidnight(new Date(solicitud.fechaInicio));
  
  return fechaInicio > fechaHoy;
};

interface UseSolicitudesControllerReturn {
  // Estado de datos
  solicitudes: SolicitudVacacionesDetailDto[];
  solicitudDetail: SolicitudVacacionesDetailDto | null;
  totalSolicitudes: number;
  
  // Estado de UI
  isLoading: boolean;
  isLoadingDetail: boolean;
  isCanceling: boolean;
  error: string;
  successMessage: string;
  
  // Estado del menú contextual
  contextMenuVisible: boolean;
  contextMenuTarget: HTMLElement | null;
  selectedContextSolicitud: SolicitudVacacionesDetailDto | null;
  
  // Filtros y paginación
  currentPage: number;
  pageSize: number;
  sortConfig: SortConfig | null;
  filters: SolicitudesQueryObject;
  
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
  loadSolicitudDetail: (solicitudId: string) => Promise<void>;
  cancelarSolicitud: (solicitudId: string, motivo: string) => Promise<void>;
  applyFilters: (newFilters: Partial<SolicitudesQueryObject>) => void;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  handleSort: (columnKey: string, isSortedDescending?: boolean) => void;
  clearError: () => void;
  clearSuccess: () => void;
  navigateToCreate: () => void;
  refreshData: () => void;
  
  // Acciones del menú contextual
  handleMenuClick: (event: any, solicitud: SolicitudVacacionesDetailDto) => void;
  getContextMenuItems: (solicitud: SolicitudVacacionesDetailDto | null) => IContextualMenuItem[];
  canCancelSolicitud: (solicitud: SolicitudVacacionesDetailDto) => boolean;
  setContextMenuVisible: (visible: boolean) => void;
  
  // Acciones específicas del menú
  handleViewDetailFromMenu: (solicitud: SolicitudVacacionesDetailDto) => Promise<void>;
  handleCancelClickFromMenu: (solicitud: SolicitudVacacionesDetailDto) => void;
  
  // Estados y handlers para modales
  selectedSolicitud: SolicitudVacacionesDetailDto | null;
  setSelectedSolicitud: (solicitud: SolicitudVacacionesDetailDto | null) => void;
  showDetailDialog: boolean;
  setShowDetailDialog: (show: boolean) => void;
  showCancelDialog: boolean;
  setShowCancelDialog: (show: boolean) => void;
  cancelMotivo: string;
  setCancelMotivo: (motivo: string) => void;
  
  // Funciones de confirmación
  handleCancelConfirm: () => Promise<void>;
  handleCancelDialogClose: () => void;
  handleDetailDialogClose: () => void;
}

export const useSolicitudesController = (): UseSolicitudesControllerReturn => {
  const navigate = useNavigate();
  
  // Estado de datos
  const [solicitudes, setSolicitudes] = useState<SolicitudVacacionesDetailDto[]>([]);
  const [solicitudDetail, setSolicitudDetail] = useState<SolicitudVacacionesDetailDto | null>(null);
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estado del menú contextual
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState<HTMLElement | null>(null);
  const [selectedContextSolicitud, setSelectedContextSolicitud] = useState<SolicitudVacacionesDetailDto | null>(null);
  
  // Estados para modales
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudVacacionesDetailDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState('');
  
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
  
  // Filtros
  const [filters, setFilters] = useState<SolicitudesQueryObject>({
    pageNumber: 1,
    pageSize: 10,
  });
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    canceladas: 0,
  });

  // Cargar solicitudes
  const loadSolicitudes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Construir filtros explícitamente como en Dashboard
      const queryParams: SolicitudesQueryObject = {
        pageNumber: currentPage,
        pageSize: pageSize,
        estado: filters.estado,
        tipoVacaciones: filters.tipoVacaciones,
        periodo: filters.periodo,
        // Agregar parámetros de ordenamiento
        sortBy: sortConfig ? mapColumnToField(sortConfig.key) : undefined,
        isDescending: sortConfig ? sortConfig.direction === 'descending' : undefined,
      };
      
      const response: MisSolicitudesResponse = await SolicitudVacacionesService.getMisSolicitudes(queryParams);
      
      setSolicitudes(response.solicitudes);
      setTotalSolicitudes(response.total);
      
      // Calcular estadísticas
      const newStats = response.solicitudes.reduce(
        (acc, solicitud) => {
          acc.total++;
          switch (solicitud.estado.toLowerCase()) {
            case 'pendiente':
              acc.pendientes++;
              break;
            case 'aprobado':
            case 'aprobada':
              acc.aprobadas++;
              break;
            case 'rechazado':
            case 'rechazada':
              acc.rechazadas++;
              break;
            case 'cancelado':
            case 'cancelada':
              acc.canceladas++;
              break;
          }
          return acc;
        },
        { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0, canceladas: 0 }
      );
      
      setStats(newStats);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al cargar las solicitudes. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error loading solicitudes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize, sortConfig]);

  // Cargar detalle de solicitud
  const loadSolicitudDetail = useCallback(async (solicitudId: string) => {
    try {
      setIsLoadingDetail(true);
      setError('');
      
      const detail = await SolicitudVacacionesService.getSolicitudDetail(solicitudId);
      setSolicitudDetail(detail);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al cargar el detalle de la solicitud.';
      setError(errorMessage);
      console.error('Error loading solicitud detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Cancelar solicitud
  const cancelarSolicitud = useCallback(async (solicitudId: string, motivo: string) => {
    try {
      setIsCanceling(true);
      setError('');
      
      await SolicitudVacacionesService.cancelarSolicitud(solicitudId, motivo);
      setSuccessMessage('Solicitud cancelada exitosamente');
      
      // Recargar datos
      await loadSolicitudes();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al cancelar la solicitud. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error canceling solicitud:', err);
    } finally {
      setIsCanceling(false);
    }
  }, [loadSolicitudes]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: Partial<SolicitudesQueryObject>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    changePage(1); // Reset a la primera página cuando se aplican filtros
  }, [changePage]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Limpiar mensaje de éxito
  const clearSuccess = useCallback(() => {
    setSuccessMessage('');
  }, []);

  // Navegar a crear solicitud
  const navigateToCreate = useCallback(() => {
    navigate('/solicitar-vacaciones');
  }, [navigate]);

  // Refrescar datos
  const refreshData = useCallback(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  // Funciones del menú contextual
  const handleMenuClick = useCallback((event: any, solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedContextSolicitud(solicitud);
    setContextMenuTarget(event.currentTarget);
    event.preventDefault();
    setContextMenuVisible(true);
  }, []);

  const canCancelSolicitud = useCallback((solicitud: SolicitudVacacionesDetailDto): boolean => {
    return validateCanCancelSolicitud(solicitud);
  }, []);

  const getContextMenuItems = useCallback((solicitud: SolicitudVacacionesDetailDto | null): IContextualMenuItem[] => {
    if (!solicitud) return [];

    const items: IContextualMenuItem[] = [
      {
        key: 'view',
        text: 'Ver detalle',
        iconProps: { iconName: 'View' },
        onClick: () => {
          setContextMenuVisible(false);
          handleViewDetailFromMenu(solicitud);
        },
      },
    ];

    if (canCancelSolicitud(solicitud)) {
      items.push({
        key: 'cancel',
        text: 'Cancelar solicitud',
        iconProps: { iconName: 'Cancel' },
        onClick: () => {
          setContextMenuVisible(false);
          handleCancelClickFromMenu(solicitud);
        },
      });
    }

    return items;
  }, [canCancelSolicitud]);

  // Acciones específicas del menú
  const handleViewDetailFromMenu = useCallback(async (solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedSolicitud(solicitud);
    await loadSolicitudDetail(solicitud.id);
    setShowDetailDialog(true);
  }, [loadSolicitudDetail]);

  const handleCancelClickFromMenu = useCallback((solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedSolicitud(solicitud);
    setCancelMotivo('');
    setShowCancelDialog(true);
  }, []);

  // Funciones de confirmación y cierre de modales
  const handleCancelConfirm = useCallback(async () => {
    if (selectedSolicitud && cancelMotivo.trim()) {
      await cancelarSolicitud(selectedSolicitud.id, cancelMotivo);
      setShowCancelDialog(false);
      setSelectedSolicitud(null);
      setCancelMotivo('');
    }
  }, [selectedSolicitud, cancelMotivo, cancelarSolicitud]);

  const handleCancelDialogClose = useCallback(() => {
    setShowCancelDialog(false);
    setSelectedSolicitud(null);
    setCancelMotivo('');
  }, []);

  const handleDetailDialogClose = useCallback(() => {
    setShowDetailDialog(false);
    setSelectedSolicitud(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  return {
    // Estado de datos
    solicitudes,
    solicitudDetail,
    totalSolicitudes,
    
    // Estado de UI
    isLoading,
    isLoadingDetail,
    isCanceling,
    error,
    successMessage,
    
    // Estado del menú contextual
    contextMenuVisible,
    contextMenuTarget,
    selectedContextSolicitud,
    
    // Filtros y paginación
    currentPage,
    pageSize,
    sortConfig,
    filters,
    
    // Estadísticas
    stats,
    
    // Acciones
    loadSolicitudes,
    loadSolicitudDetail,
    cancelarSolicitud,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    navigateToCreate,
    refreshData,
    
    // Acciones del menú contextual
    handleMenuClick,
    getContextMenuItems,
    canCancelSolicitud,
    setContextMenuVisible,
    
    // Acciones específicas del menú
    handleViewDetailFromMenu,
    handleCancelClickFromMenu,
    
    // Estados y handlers para modales
    selectedSolicitud,
    setSelectedSolicitud,
    showDetailDialog,
    setShowDetailDialog,
    showCancelDialog,
    setShowCancelDialog,
    cancelMotivo,
    setCancelMotivo,
    
    // Funciones de confirmación
    handleCancelConfirm,
    handleCancelDialogClose,
    handleDetailDialogClose,
  };
};

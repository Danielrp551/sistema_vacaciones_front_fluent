import React, { useState } from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  PrimaryButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Spinner,
  SpinnerSize,
  IconButton,
  Dialog,
  DialogType,
  DialogFooter,
  TextField,
  Icon,
  CommandBarButton,
  Toggle,
  ContextualMenu,
  DirectionalHint,
  DatePicker,
} from '@fluentui/react';
import type { IColumn, IDropdownOption, IContextualMenuItem, IDatePickerStrings } from '@fluentui/react';
import { useGestionSolicitudesController } from './GestionSolicitudes.controller';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
  filtersContainerStyles,
  statsGridStyles,
  statCardStyles,
  statNumberStyles,
  statLabelStyles,
  listContainerStyles,
  tableContainerStyles,
  loadingContainerStyles,
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateMessageStyles,
  paginationContainerStyles,
} from './GestionSolicitudes.styles';
import type { SolicitudVacacionesDetailDto } from '../../services/solicitudVacaciones.service';

const GestionSolicitudes: React.FC = () => {
  const {
    solicitudes,
    totalCompleto,
    empleados,
    isLoading,
    isProcessing,
    error,
    successMessage,
    currentPage,
    pageSize,
    filters,
    sortConfig,
    stats,
    aprobarSolicitud,
    rechazarSolicitud,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    refreshData,
  } = useGestionSolicitudesController();

  // Estado para diálogos y modales
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudVacacionesDetailDto | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [approveComments, setApproveComments] = useState('');
  const [rejectComments, setRejectComments] = useState('');
  
  // Estado para menú contextual
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState<HTMLElement | null>(null);
  const [contextMenuSolicitud, setContextMenuSolicitud] = useState<SolicitudVacacionesDetailDto | null>(null);

  // Estado para filtros de fecha
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<Date | undefined>(undefined);
  const [fechaFinFiltro, setFechaFinFiltro] = useState<Date | undefined>(undefined);

  // Configuración de idioma para DatePicker
  const datePickerStrings: IDatePickerStrings = {
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    shortDays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    goToToday: 'Ir a hoy',
    weekNumberFormatString: 'Semana {0}',
    prevMonthAriaLabel: 'Mes anterior',
    nextMonthAriaLabel: 'Mes siguiente',
    prevYearAriaLabel: 'Año anterior',
    nextYearAriaLabel: 'Año siguiente',
    invalidInputErrorMessage: 'Formato de fecha inválido.',
  };

  // Opciones para filtros
  const estadoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los estados' },
    { key: 'pendiente', text: 'Pendiente' },
    { key: 'aprobado', text: 'Aprobado' },
    { key: 'rechazado', text: 'Rechazado' },
    { key: 'cancelado', text: 'Cancelado' },
  ];

  const tipoVacacionesOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los tipos' },
    { key: 'libres', text: 'Libres' },
    { key: 'bloque', text: 'Bloque' },
  ];

  const periodoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los períodos' },
    { key: '2024', text: '2024' },
    { key: '2025', text: '2025' },
    { key: '2026', text: '2026' },
  ];

  const empleadoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los empleados' },
    ...empleados.map(emp => ({
      key: emp.id,
      text: `${emp.nombreCompleto}${emp.esDirecto ? ' (Directo)' : ' (Indirecto)'}`,
    })),
  ];

  // Formatear fecha para mostrar
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Obtener el color del estado
  const getEstadoColor = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return '#d83b01'; // Orange
      case 'aprobado':
      case 'aprobada':
        return '#107c10'; // Green
      case 'rechazado':
      case 'rechazada':
        return '#d13438'; // Red
      case 'cancelado':
      case 'cancelada':
        return '#605e5c'; // Gray
      default:
        return '#323130'; // Default
    }
  };

  // Verificar si una solicitud puede ser aprobada/rechazada
  const canApproveSolicitud = (solicitud: SolicitudVacacionesDetailDto): boolean => {
    return solicitud.estado.toLowerCase() === 'pendiente' && solicitud.puedeAprobar;
  };

  // Columnas de la tabla
  const columns: IColumn[] = [
    {
      key: 'acciones',
      name: 'Acciones',
      fieldName: 'acciones',
      minWidth: 30,
      maxWidth: 40,
      isResizable: false,
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => {
        return (
          <IconButton
            iconProps={{ iconName: 'More' }}
            title="Acciones"
            ariaLabel="Acciones"
            onClick={(e) => handleMenuClick(e, item)}
            styles={{
              root: { 
                width: '32px', 
                height: '32px',
                borderRadius: '4px',
              },
              rootHovered: {
                backgroundColor: '#f3f2f1',
              },
            }}
          />
        );
      },
    },
    {
      key: 'id',
      name: 'ID',
      fieldName: 'id',
      minWidth: 60,
      maxWidth: 80,
      isResizable: false,
      isSorted: sortConfig?.key === 'id',
      isSortedDescending: sortConfig?.key === 'id' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('id', sortConfig?.key === 'id' && sortConfig.direction === 'ascending'),
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
          #{item.id}
        </Text>
      ),
    },
    {
      key: 'solicitante',
      name: 'Solicitante',
      fieldName: 'nombreSolicitante',
      minWidth: 120,
      maxWidth: 180,
      isResizable: false,
      isSorted: sortConfig?.key === 'solicitante',
      isSortedDescending: sortConfig?.key === 'solicitante' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('solicitante', sortConfig?.key === 'solicitante' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '500' } }}>
          {item.nombreSolicitante}
        </Text>
      ),
    },
    {
      key: 'tipoVacaciones',
      name: 'Tipo',
      fieldName: 'tipoVacaciones',
      minWidth: 70,
      maxWidth: 90,
      isResizable: false,
      isSorted: sortConfig?.key === 'tipoVacaciones',
      isSortedDescending: sortConfig?.key === 'tipoVacaciones' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('tipoVacaciones', sortConfig?.key === 'tipoVacaciones' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { textTransform: 'capitalize' } }}>
          {item.tipoVacaciones}
        </Text>
      ),
    },
    {
      key: 'fechaInicio',
      name: 'F. Inicio',
      fieldName: 'fechaInicio',
      minWidth: 90,
      maxWidth: 110,
      isResizable: false,
      isSorted: sortConfig?.key === 'fechaInicio',
      isSortedDescending: sortConfig?.key === 'fechaInicio' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('fechaInicio', sortConfig?.key === 'fechaInicio' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
          {formatDate(item.fechaInicio)}
        </Text>
      ),
    },
    {
      key: 'fechaFin',
      name: 'F. Fin',
      fieldName: 'fechaFin',
      minWidth: 90,
      maxWidth: 110,
      isResizable: false,
      isSorted: sortConfig?.key === 'fechaFin',
      isSortedDescending: sortConfig?.key === 'fechaFin' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('fechaFin', sortConfig?.key === 'fechaFin' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
          {formatDate(item.fechaFin)}
        </Text>
      ),
    },
    {
      key: 'diasSolicitados',
      name: 'Días',
      fieldName: 'diasSolicitados',
      minWidth: 60,
      maxWidth: 80,
      isResizable: false,
      isSorted: sortConfig?.key === 'diasSolicitados',
      isSortedDescending: sortConfig?.key === 'diasSolicitados' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('diasSolicitados', sortConfig?.key === 'diasSolicitados' && sortConfig.direction === 'ascending'),
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '600', textAlign: 'center', color: '#0078d4' } }}>
          {item.diasSolicitados}
        </Text>
      ),
    },
    {
      key: 'estado',
      name: 'Estado',
      fieldName: 'estado',
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      isSorted: sortConfig?.key === 'estado',
      isSortedDescending: sortConfig?.key === 'estado' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('estado', sortConfig?.key === 'estado' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text
          variant="small"
          styles={{
            root: {
              backgroundColor: `${getEstadoColor(item.estado)}15`,
              color: getEstadoColor(item.estado),
              padding: '4px 8px',
              borderRadius: '12px',
              fontWeight: '600',
              textTransform: 'capitalize',
              textAlign: 'center',
              fontSize: '11px',
              display: 'inline-block',
              minWidth: '70px',
            },
          }}
        >
          {item.estado}
        </Text>
      ),
    },
    {
      key: 'fechaSolicitud',
      name: 'Solicitado',
      fieldName: 'fechaSolicitud',
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      isSorted: sortConfig?.key === 'fechaSolicitud',
      isSortedDescending: sortConfig?.key === 'fechaSolicitud' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('fechaSolicitud', sortConfig?.key === 'fechaSolicitud' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
          {formatDate(item.fechaSolicitud)}
        </Text>
      ),
    },
    {
      key: 'periodo',
      name: 'Período',
      fieldName: 'periodo',
      minWidth: 70,
      maxWidth: 90,
      isResizable: false,
      isSorted: sortConfig?.key === 'periodo',
      isSortedDescending: sortConfig?.key === 'periodo' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('periodo', sortConfig?.key === 'periodo' && sortConfig.direction === 'ascending'),
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '500' } }}>
          {item.periodo}
        </Text>
      ),
    },
    {
      key: 'manager',
      name: 'Manager',
      fieldName: 'nombreJefeDirecto',
      minWidth: 120,
      maxWidth: 150,
      isResizable: false,
      isSorted: sortConfig?.key === 'manager',
      isSortedDescending: sortConfig?.key === 'manager' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('manager', sortConfig?.key === 'manager' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => {
        if (item.nombreJefeDirecto) {
          return (
            <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
              {item.nombreJefeDirecto}
            </Text>
          );
        } else {
          return (
            <Text variant="small" styles={{ root: { color: '#605e5c', fontStyle: 'italic' } }}>
              Sin asignar
            </Text>
          );
        }
      },
    },
    {
      key: 'aprobadoPor',
      name: 'Aprobado por',
      fieldName: 'nombreAprobador',
      minWidth: 120,
      maxWidth: 150,
      isResizable: false,
      isSorted: sortConfig?.key === 'aprobadoPor',
      isSortedDescending: sortConfig?.key === 'aprobadoPor' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('aprobadoPor', sortConfig?.key === 'aprobadoPor' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => {
        if (item.nombreAprobador && item.estado.toLowerCase() !== 'pendiente') {
          return (
            <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
              {item.nombreAprobador}
            </Text>
          );
        } else if (item.estado.toLowerCase() === 'pendiente') {
          return (
            <Text variant="small" styles={{ root: { color: '#d83b01', fontStyle: 'italic' } }}>
              Pendiente
            </Text>
          );
        } else {
          return (
            <Text variant="small" styles={{ root: { color: '#605e5c', fontStyle: 'italic' } }}>
              -
            </Text>
          );
        }
      },
    },
    {
      key: 'fechaGestion',
      name: 'F. Gestión',
      fieldName: 'fechaAprobacion',
      minWidth: 90,
      maxWidth: 110,
      isResizable: false,
      isSorted: sortConfig?.key === 'fechaGestion',
      isSortedDescending: sortConfig?.key === 'fechaGestion' && sortConfig.direction === 'descending',
      onColumnClick: () => handleSort('fechaGestion', sortConfig?.key === 'fechaGestion' && sortConfig.direction === 'ascending'),
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => {
        if (item.fechaAprobacion) {
          return (
            <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
              {formatDate(item.fechaAprobacion)}
            </Text>
          );
        } else if (item.estado.toLowerCase() === 'pendiente') {
          return (
            <Text variant="small" styles={{ root: { color: '#d83b01', fontStyle: 'italic' } }}>
              Pendiente
            </Text>
          );
        } else {
          return (
            <Text variant="small" styles={{ root: { color: '#605e5c', fontStyle: 'italic' } }}>
              -
            </Text>
          );
        }
      },
    },
  ];

  // Manejar cambios en filtros de fecha
  const handleFechaInicioChange = (date: Date | null | undefined) => {
    setFechaInicioFiltro(date || undefined);
    
    // Validar que la fecha de inicio no sea posterior a la fecha fin
    if (date && fechaFinFiltro && date > fechaFinFiltro) {
      setFechaFinFiltro(undefined);
      handleFilterChange('fechaFinRango', undefined);
    }
    
    if (date) {
      const dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      handleFilterChange('fechaInicioRango', dateString);
    } else {
      handleFilterChange('fechaInicioRango', undefined);
    }
  };

  const handleFechaFinChange = (date: Date | null | undefined) => {
    setFechaFinFiltro(date || undefined);
    
    // Validar que la fecha fin no sea anterior a la fecha de inicio
    if (date && fechaInicioFiltro && date < fechaInicioFiltro) {
      setFechaInicioFiltro(undefined);
      handleFilterChange('fechaInicioRango', undefined);
    }
    
    if (date) {
      const dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      handleFilterChange('fechaFinRango', dateString);
    } else {
      handleFilterChange('fechaFinRango', undefined);
    }
  };

  // Manejador del menú contextual
  const handleMenuClick = (event: any, solicitud: SolicitudVacacionesDetailDto) => {
    event.preventDefault();
    setContextMenuTarget(event.currentTarget);
    setContextMenuSolicitud(solicitud);
    setContextMenuVisible(true);
  };

  // Crear elementos del menú contextual
  const getContextMenuItems = (solicitud: SolicitudVacacionesDetailDto | null): IContextualMenuItem[] => {
    if (!solicitud) return [];

    const items: IContextualMenuItem[] = [
      {
        key: 'view',
        text: 'Ver detalle',
        iconProps: { iconName: 'View' },
        onClick: () => {
          handleViewDetail(solicitud);
          setContextMenuVisible(false);
        },
      },
    ];

    if (canApproveSolicitud(solicitud)) {
      items.push(
        {
          key: 'approve',
          text: 'Aprobar',
          iconProps: { iconName: 'Accept' },
          onClick: () => {
            handleApproveClick(solicitud);
            setContextMenuVisible(false);
          },
        },
        {
          key: 'reject',
          text: 'Rechazar',
          iconProps: { iconName: 'Cancel' },
          onClick: () => {
            handleRejectClick(solicitud);
            setContextMenuVisible(false);
          },
        }
      );
    }

    return items;
  };

  // Manejadores de eventos
  const handleViewDetail = (solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedSolicitud(solicitud);
    setShowDetailDialog(true);
  };

  const handleApproveClick = (solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedSolicitud(solicitud);
    setApproveComments('');
    setShowApproveDialog(true);
  };

  const handleRejectClick = (solicitud: SolicitudVacacionesDetailDto) => {
    setSelectedSolicitud(solicitud);
    setRejectComments('');
    setShowRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    if (selectedSolicitud) {
      await aprobarSolicitud(selectedSolicitud.id, approveComments);
      setShowApproveDialog(false);
      setSelectedSolicitud(null);
      setApproveComments('');
    }
  };

  const handleRejectConfirm = async () => {
    if (selectedSolicitud && rejectComments.trim()) {
      await rechazarSolicitud(selectedSolicitud.id, rejectComments);
      setShowRejectDialog(false);
      setSelectedSolicitud(null);
      setRejectComments('');
    }
  };

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    if (key === 'estado') {
      applyFilters({ estado: value as string || undefined });
    } else if (key === 'tipoVacaciones') {
      applyFilters({ tipoVacaciones: value as string || undefined });
    } else if (key === 'periodo') {
      applyFilters({ periodo: value ? parseInt(value as string) : undefined });
    } else if (key === 'empleadoId') {
      applyFilters({ empleadoId: value as string || undefined });
    } else if (key === 'incluirSubordinadosNivelN') {
      applyFilters({ incluirSubordinadosNivelN: value as boolean });
    } else if (key === 'fechaInicioRango') {
      applyFilters({ fechaInicioRango: value as string || undefined });
    } else if (key === 'fechaFinRango') {
      applyFilters({ fechaFinRango: value as string || undefined });
    }
  };

  const clearFilters = () => {
    // Limpiar también los estados locales de fecha
    setFechaInicioFiltro(undefined);
    setFechaFinFiltro(undefined);
    
    applyFilters({
      estado: undefined,
      tipoVacaciones: undefined,
      periodo: undefined,
      empleadoId: undefined,
      incluirSubordinadosNivelN: false,
      fechaInicioRango: undefined,
      fechaFinRango: undefined,
    });
  };

  // Calcular información de paginación
  const totalPages = Math.ceil(totalCompleto / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCompleto);

  return (
    <Stack styles={containerStyles} tokens={{ childrenGap: 24 }}>
      {/* Header */}
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        wrap
        styles={headerStyles}
        tokens={{ childrenGap: 16 }}
      >
        <Stack tokens={{ childrenGap: 8 }}>
          <Text styles={titleStyles}>Gestión de Solicitudes</Text>
          <Text styles={subtitleStyles}>
            Administra las solicitudes de vacaciones de tu equipo
          </Text>
        </Stack>
      </Stack>

      {/* Mensajes de estado */}
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={clearError}
          dismissButtonAriaLabel="Cerrar"
        >
          {error}
        </MessageBar>
      )}

      {successMessage && (
        <MessageBar
          messageBarType={MessageBarType.success}
          onDismiss={clearSuccess}
          dismissButtonAriaLabel="Cerrar"
        >
          {successMessage}
        </MessageBar>
      )}

      {/* Tarjetas de estadísticas */}
      <Stack
        horizontal
        horizontalAlign="center"
        wrap
        tokens={{ childrenGap: 16 }}
        styles={statsGridStyles}
      >
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{stats.total}</Text>
          <Text styles={statLabelStyles}>Total</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#d83b01', margin: '0 0 4px 0' } }}>
            {stats.pendientes}
          </Text>
          <Text styles={statLabelStyles}>Pendientes</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#107c10', margin: '0 0 4px 0' } }}>
            {stats.aprobadas}
          </Text>
          <Text styles={statLabelStyles}>Aprobadas</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#d13438', margin: '0 0 4px 0' } }}>
            {stats.rechazadas}
          </Text>
          <Text styles={statLabelStyles}>Rechazadas</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#605e5c', margin: '0 0 4px 0' } }}>
            {stats.canceladas}
          </Text>
          <Text styles={statLabelStyles}>Canceladas</Text>
        </Stack>
      </Stack>

      {/* Filtros */}
      <Stack styles={filtersContainerStyles} tokens={{ childrenGap: 16 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
          Filtros
        </Text>
        
        <Toggle
          label="Incluir subordinados de todos los niveles"
          checked={filters.incluirSubordinadosNivelN || false}
          onChange={(_, checked) => handleFilterChange('incluirSubordinadosNivelN', checked)}
          onText="Todos los niveles"
          offText="Solo directos"
        />

        <Stack
          horizontal
          wrap
          tokens={{ childrenGap: 16 }}
          styles={{ 
            root: { 
              alignItems: 'end',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            } 
          }}
        >
          <Dropdown
            placeholder="Empleado"
            label="Empleado"
            options={empleadoOptions}
            selectedKey={filters.empleadoId || ''}
            onChange={(_, option) => handleFilterChange('empleadoId', option?.key as string)}
            styles={{ root: { minWidth: 200, width: '100%', maxWidth: 250 } }}
          />
          <Dropdown
            placeholder="Estado"
            label="Estado"
            options={estadoOptions}
            selectedKey={filters.estado || ''}
            onChange={(_, option) => handleFilterChange('estado', option?.key as string)}
            styles={{ root: { minWidth: 150, width: '100%', maxWidth: 200 } }}
          />
          <Dropdown
            placeholder="Tipo de vacaciones"
            label="Tipo"
            options={tipoVacacionesOptions}
            selectedKey={filters.tipoVacaciones || ''}
            onChange={(_, option) => handleFilterChange('tipoVacaciones', option?.key as string)}
            styles={{ root: { minWidth: 150, width: '100%', maxWidth: 200 } }}
          />
          <Dropdown
            placeholder="Período"
            label="Período"
            options={periodoOptions}
            selectedKey={filters.periodo?.toString() || ''}
            onChange={(_, option) => handleFilterChange('periodo', option?.key as string)}
            styles={{ root: { minWidth: 120, width: '100%', maxWidth: 150 } }}
          />
        </Stack>
        
        {/* Filtros de fecha */}
        <Stack tokens={{ childrenGap: 12 }}>
          <Text variant="medium" styles={{ root: { fontWeight: '600', color: '#323130' } }}>
            Filtro por fecha de inicio de vacaciones
          </Text>
          
          <Stack
            horizontal
            wrap
            tokens={{ childrenGap: 20 }}
            styles={{ 
              root: { 
                alignItems: 'end',
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e1e5e9',
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }
              } 
            }}
          >
            <Stack tokens={{ childrenGap: 4 }}>
              <Text variant="medium" styles={{ root: { fontSize: '14px', fontWeight: '600', color: '#323130', marginBottom: '4px' } }}>
                Desde
              </Text>
              <DatePicker
                placeholder="Seleccionar fecha..."
                value={fechaInicioFiltro}
                onSelectDate={handleFechaInicioChange}
                strings={datePickerStrings}
                formatDate={(date) => date ? formatDate(date.toISOString()) : ''}
                styles={{ 
                  root: { 
                    minWidth: 160, 
                    width: '100%', 
                    maxWidth: 200 
                  },
                  textField: { 
                    fontSize: '14px',
                    borderRadius: '4px',
                  }
                }}
                allowTextInput={false}
                showMonthPickerAsOverlay={true}
                maxDate={fechaFinFiltro || undefined}
              />
              <Text variant="xSmall" styles={{ root: { color: '#605e5c', fontStyle: 'italic' } }}>
                Fecha mínima de inicio
              </Text>
            </Stack>
            
            <Stack tokens={{ childrenGap: 4 }}>
              <Text variant="medium" styles={{ root: { fontSize: '14px', fontWeight: '600', color: '#323130', marginBottom: '4px' } }}>
                Hasta
              </Text>
              <DatePicker
                placeholder="Seleccionar fecha..."
                value={fechaFinFiltro}
                onSelectDate={handleFechaFinChange}
                strings={datePickerStrings}
                formatDate={(date) => date ? formatDate(date.toISOString()) : ''}
                styles={{ 
                  root: { 
                    minWidth: 160, 
                    width: '100%', 
                    maxWidth: 200 
                  },
                  textField: { 
                    fontSize: '14px',
                    borderRadius: '4px',
                  }
                }}
                allowTextInput={false}
                showMonthPickerAsOverlay={true}
                minDate={fechaInicioFiltro || undefined}
              />
              <Text variant="xSmall" styles={{ root: { color: '#605e5c', fontStyle: 'italic' } }}>
                Fecha máxima de inicio
              </Text>
            </Stack>
            
            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { marginTop: '8px' } }}>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <Icon 
                  iconName="Info" 
                  styles={{ 
                    root: { 
                      fontSize: '14px', 
                      color: '#0078d4',
                      marginTop: '2px'
                    } 
                  }} 
                />
                <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
                  Filtra las solicitudes por el rango de fechas en que iniciarían las vacaciones
                </Text>
              </Stack>
              
              {(fechaInicioFiltro || fechaFinFiltro) && (
                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" styles={{ root: { marginTop: '8px' } }}>
                  <Stack tokens={{ childrenGap: 4 }}>
                    {fechaInicioFiltro && fechaFinFiltro && (
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: '600' } }}>
                        Rango: {formatDate(fechaInicioFiltro.toISOString())} - {formatDate(fechaFinFiltro.toISOString())}
                      </Text>
                    )}
                    {fechaInicioFiltro && !fechaFinFiltro && (
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: '600' } }}>
                        Desde: {formatDate(fechaInicioFiltro.toISOString())}
                      </Text>
                    )}
                    {!fechaInicioFiltro && fechaFinFiltro && (
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: '600' } }}>
                        Hasta: {formatDate(fechaFinFiltro.toISOString())}
                      </Text>
                    )}
                    
                    <DefaultButton
                      text="Limpiar fechas"
                      iconProps={{ iconName: 'Clear' }}
                      onClick={() => {
                        setFechaInicioFiltro(undefined);
                        setFechaFinFiltro(undefined);
                        handleFilterChange('fechaInicioRango', undefined);
                        handleFilterChange('fechaFinRango', undefined);
                      }}
                      styles={{
                        root: {
                          minHeight: '32px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderRadius: '4px',
                        }
                      }}
                    />
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
        
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            iconProps={{ iconName: 'Clear' }}
            text="Limpiar filtros"
            onClick={clearFilters}
          />
          <CommandBarButton
            iconProps={{ iconName: 'Refresh' }}
            text="Actualizar"
            onClick={refreshData}
          />
        </Stack>
      </Stack>

      {/* Lista de solicitudes */}
      <Stack styles={listContainerStyles}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{
            root: {
              backgroundColor: '#faf9f8',
              borderBottom: '1px solid #edebe9',
              padding: '16px 20px',
            },
          }}
        >
          <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
            Solicitudes del Equipo ({totalCompleto})
          </Text>
        </Stack>

        {isLoading ? (
          <Stack styles={loadingContainerStyles}>
            <Spinner size={SpinnerSize.large} label="Cargando solicitudes..." />
          </Stack>
        ) : solicitudes.length === 0 ? (
          <Stack styles={emptyStateStyles}>
            <Icon iconName="PeopleBlock" style={emptyStateIconStyles} />
            <Text styles={emptyStateTitleStyles}>No hay solicitudes</Text>
            <Text styles={emptyStateMessageStyles}>
              No se encontraron solicitudes de tu equipo con los filtros aplicados.
            </Text>
          </Stack>
        ) : (
          <>
            <Stack styles={tableContainerStyles}>
              <div className="vacation-table-container">
                <DetailsList
                  items={solicitudes}
                  columns={columns}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selectionMode={SelectionMode.none}
                  isHeaderVisible={true}
                  compact={true}
                  setKey="gestionSolicitudes"
                  onShouldVirtualize={() => false}
                />
              </div>
            </Stack>

            {/* Paginación */}
            {totalCompleto > 0 && (
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                styles={paginationContainerStyles}
                tokens={{ childrenGap: 24 }}
                wrap
              >
                {/* Información y selector de tamaño de página */}
                <Stack horizontal tokens={{ childrenGap: 24 }} verticalAlign="center" wrap>
                  <Text styles={{ 
                    root: { 
                      fontSize: '14px', 
                      color: '#605e5c', 
                      fontWeight: '500',
                      minWidth: '200px',
                    } 
                  }}>
                    Mostrando {startItem}-{endItem} de {totalCompleto} solicitudes
                  </Text>
                  
                  <Stack 
                    horizontal 
                    tokens={{ childrenGap: 8 }} 
                    verticalAlign="center"
                    styles={{
                      root: {
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #e1e5e9',
                        minWidth: '160px',
                      }
                    }}
                  >
                    <Text styles={{ root: { fontSize: '14px', color: '#323130', fontWeight: '500' } }}>
                      Mostrar
                    </Text>
                    <Dropdown
                      options={[
                        { key: 5, text: '5' },
                        { key: 10, text: '10' },
                        { key: 25, text: '25' },
                        { key: 50, text: '50' },
                        { key: 100, text: '100' },
                      ]}
                      selectedKey={pageSize}
                      onChange={(_, option) => {
                        if (option) {
                          changePageSize(Number(option.key));
                        }
                      }}
                      styles={{
                        dropdown: { 
                          width: 80,
                          minWidth: 80,
                        },
                        title: { 
                          fontSize: '14px', 
                          padding: '6px 12px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontWeight: '500',
                        },
                        dropdownItem: { 
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                        dropdownItemSelected: {
                          backgroundColor: '#0078d4',
                          color: '#ffffff',
                        },
                        callout: {
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    />
                    <Text styles={{ root: { fontSize: '14px', color: '#323130', fontWeight: '500' } }}>
                      elementos
                    </Text>
                  </Stack>
                </Stack>

                {/* Controles de navegación */}
                {totalPages > 1 && (
                  <Stack 
                    horizontal 
                    tokens={{ childrenGap: 4 }} 
                    verticalAlign="center"
                    styles={{
                      root: {
                        padding: '4px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e1e5e9',
                      }
                    }}
                  >
                    {/* Primera página */}
                    <DefaultButton
                      text="‹‹"
                      title="Primera página"
                      disabled={currentPage === 1}
                      onClick={() => changePage(1)}
                      styles={{
                        root: { 
                          minWidth: '36px', 
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          margin: '2px',
                          color: currentPage === 1 ? '#a19f9d' : '#0078d4',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                        rootHovered: currentPage !== 1 ? {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #0078d4',
                          transform: 'translateY(-1px)',
                        } : {
                          backgroundColor: '#f8f9fa',
                        },
                        rootPressed: currentPage !== 1 ? {
                          backgroundColor: '#f3f2f1',
                          transform: 'translateY(0px)',
                        } : {},
                        rootDisabled: {
                          backgroundColor: '#f8f9fa',
                          color: '#a19f9d',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                    
                    {/* Página anterior */}
                    <DefaultButton
                      text="‹"
                      title="Página anterior"
                      disabled={currentPage === 1}
                      onClick={() => changePage(currentPage - 1)}
                      styles={{
                        root: { 
                          minWidth: '36px', 
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          margin: '2px',
                          color: currentPage === 1 ? '#a19f9d' : '#0078d4',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                        rootHovered: currentPage !== 1 ? {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #0078d4',
                          transform: 'translateY(-1px)',
                        } : {
                          backgroundColor: '#f8f9fa',
                        },
                        rootPressed: currentPage !== 1 ? {
                          backgroundColor: '#f3f2f1',
                          transform: 'translateY(0px)',
                        } : {},
                        rootDisabled: {
                          backgroundColor: '#f8f9fa',
                          color: '#a19f9d',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                    
                    {/* Indicador de página actual */}
                    <Stack 
                      verticalAlign="center" 
                      horizontalAlign="center"
                      styles={{
                        root: {
                          minWidth: '120px',
                          padding: '8px 16px',
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          margin: '2px',
                        }
                      }}
                    >
                      <Text styles={{ 
                        root: { 
                          fontSize: '14px', 
                          color: '#323130', 
                          fontWeight: '600',
                          textAlign: 'center',
                        } 
                      }}>
                        {currentPage} de {totalPages}
                      </Text>
                    </Stack>
                    
                    {/* Página siguiente */}
                    <DefaultButton
                      text="›"
                      title="Página siguiente"
                      disabled={currentPage === totalPages}
                      onClick={() => changePage(currentPage + 1)}
                      styles={{
                        root: { 
                          minWidth: '36px', 
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          margin: '2px',
                          color: currentPage === totalPages ? '#a19f9d' : '#0078d4',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                        rootHovered: currentPage !== totalPages ? {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #0078d4',
                          transform: 'translateY(-1px)',
                        } : {
                          backgroundColor: '#f8f9fa',
                        },
                        rootPressed: currentPage !== totalPages ? {
                          backgroundColor: '#f3f2f1',
                          transform: 'translateY(0px)',
                        } : {},
                        rootDisabled: {
                          backgroundColor: '#f8f9fa',
                          color: '#a19f9d',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                    
                    {/* Última página */}
                    <DefaultButton
                      text="››"
                      title="Última página"
                      disabled={currentPage === totalPages}
                      onClick={() => changePage(totalPages)}
                      styles={{
                        root: { 
                          minWidth: '36px', 
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          margin: '2px',
                          color: currentPage === totalPages ? '#a19f9d' : '#0078d4',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                        rootHovered: currentPage !== totalPages ? {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #0078d4',
                          transform: 'translateY(-1px)',
                        } : {
                          backgroundColor: '#f8f9fa',
                        },
                        rootPressed: currentPage !== totalPages ? {
                          backgroundColor: '#f3f2f1',
                          transform: 'translateY(0px)',
                        } : {},
                        rootDisabled: {
                          backgroundColor: '#f8f9fa',
                          color: '#a19f9d',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            )}
          </>
        )}
      </Stack>

      {/* Menú contextual */}
      {contextMenuVisible && (
        <ContextualMenu
          items={getContextMenuItems(contextMenuSolicitud)}
          hidden={!contextMenuVisible}
          target={contextMenuTarget}
          onItemClick={() => setContextMenuVisible(false)}
          onDismiss={() => setContextMenuVisible(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
        />
      )}

      {/* Dialog para aprobar solicitud */}
      <Dialog
        hidden={!showApproveDialog}
        onDismiss={() => setShowApproveDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Aprobar Solicitud',
          subText: selectedSolicitud
            ? `¿Estás seguro de que deseas aprobar la solicitud #${selectedSolicitud.id} de ${selectedSolicitud.nombreSolicitante}?`
            : '',
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 500 } },
        }}
      >
        <TextField
          label="Comentarios (opcional)"
          multiline
          rows={3}
          value={approveComments}
          onChange={(_, newValue) => setApproveComments(newValue || '')}
          placeholder="Agrega comentarios sobre la aprobación..."
        />
        <DialogFooter>
          <PrimaryButton
            onClick={handleApproveConfirm}
            text="Aprobar Solicitud"
            disabled={isProcessing}
            iconProps={{ iconName: 'Accept' }}
          />
          <DefaultButton 
            onClick={() => setShowApproveDialog(false)} 
            text="Cancelar" 
            disabled={isProcessing}
          />
        </DialogFooter>
      </Dialog>

      {/* Dialog para rechazar solicitud */}
      <Dialog
        hidden={!showRejectDialog}
        onDismiss={() => setShowRejectDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Rechazar Solicitud',
          subText: selectedSolicitud
            ? `¿Estás seguro de que deseas rechazar la solicitud #${selectedSolicitud.id} de ${selectedSolicitud.nombreSolicitante}?`
            : '',
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 500 } },
        }}
      >
        <TextField
          label="Motivo de rechazo"
          multiline
          rows={3}
          value={rejectComments}
          onChange={(_, newValue) => setRejectComments(newValue || '')}
          placeholder="Explica el motivo del rechazo de la solicitud..."
          required
          errorMessage={!rejectComments.trim() ? 'El motivo de rechazo es obligatorio' : ''}
        />
        <DialogFooter>
          <PrimaryButton
            onClick={handleRejectConfirm}
            text="Rechazar Solicitud"
            disabled={!rejectComments.trim() || isProcessing}
            iconProps={{ iconName: 'Cancel' }}
            styles={{
              root: { backgroundColor: '#d13438', borderColor: '#d13438' },
              rootHovered: { backgroundColor: '#b92b2f', borderColor: '#b92b2f' },
            }}
          />
          <DefaultButton 
            onClick={() => setShowRejectDialog(false)} 
            text="Cancelar" 
            disabled={isProcessing}
          />
        </DialogFooter>
      </Dialog>

      {/* Dialog para ver detalle */}
      <Dialog
        hidden={!showDetailDialog}
        onDismiss={() => setShowDetailDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Detalle de Solicitud',
          subText: selectedSolicitud
            ? `Solicitud #${selectedSolicitud.id} - ${selectedSolicitud.nombreSolicitante}`
            : '',
        }}
        modalProps={{
          isBlocking: false,
          styles: { 
            main: { 
              width: '80vw',
              maxWidth: '1100px',
              minWidth: '800px',
              maxHeight: '80vh',
              minHeight: '500px',
              overflow: 'hidden',
              margin: '5vh auto',
              '@media (max-width: 1400px)': {
                width: '85vw',
                maxWidth: 'none',
                minWidth: '700px',
                maxHeight: '85vh',
                margin: '4vh auto',
              },
              '@media (max-width: 1024px)': {
                width: '90vw',
                maxWidth: 'none',
                minWidth: '600px',
                maxHeight: '88vh',
                margin: '3vh auto',
              },
              '@media (max-width: 768px)': {
                width: '95vw',
                maxWidth: 'none',
                minWidth: '320px',
                maxHeight: '92vh',
                margin: '2vh auto',
              }
            } 
          },
        }}
      >
        {selectedSolicitud && (
          <div 
            style={{ 
              maxHeight: 'calc(50vh)', 
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '12px',
              marginRight: '-12px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#c8c8c8 transparent'
            }}
            className="modal-scroll-container"
          >
            <Stack tokens={{ childrenGap: 18 }} styles={{ root: { padding: '16px 32px 20px 32px', width: '100%', boxSizing: 'border-box' } }}>
            {/* Primera fila: Información del Empleado y Detalles de la Solicitud */}
            <Stack 
              horizontal 
              wrap 
              tokens={{ childrenGap: 32 }}
              styles={{
                root: {
                  '@media (max-width: 1024px)': {
                    flexDirection: 'column',
                  }
                }
              }}
            >
              {/* Columna Izquierda: Información del Empleado */}
              <Stack 
                tokens={{ childrenGap: 16 }} 
                styles={{ 
                  root: { 
                    flex: '1 1 420px', 
                    minWidth: '400px',
                    maxWidth: '500px',
                    '@media (max-width: 1024px)': {
                      minWidth: '100%',
                      maxWidth: 'none',
                    }
                  } 
                }}
              >
                <Text variant="large" styles={{ root: { fontWeight: '600', color: '#323130', borderBottom: '2px solid #0078d4', paddingBottom: '8px' } }}>
                  Información del Empleado
                </Text>
                <Stack tokens={{ childrenGap: 12 }}>
                  <TextField
                    label="Nombre del Solicitante"
                    value={selectedSolicitud.nombreSolicitante}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                  <TextField
                    label="Email"
                    value={selectedSolicitud.emailSolicitante}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                  <TextField
                    label="Manager Directo"
                    value={selectedSolicitud.nombreJefeDirecto || 'Sin asignar'}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                  <TextField
                    label="Período"
                    value={selectedSolicitud.periodo.toString()}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                </Stack>
              </Stack>

              {/* Columna Derecha: Detalles de la Solicitud */}
              <Stack 
                tokens={{ childrenGap: 16 }} 
                styles={{ 
                  root: { 
                    flex: '1 1 420px', 
                    minWidth: '400px',
                    maxWidth: '500px',
                    '@media (max-width: 1024px)': {
                      minWidth: '100%',
                      maxWidth: 'none',
                    }
                  } 
                }}
              >
                <Text variant="large" styles={{ root: { fontWeight: '600', color: '#323130', borderBottom: '2px solid #0078d4', paddingBottom: '8px' } }}>
                  Detalles de la Solicitud
                </Text>
                <Stack tokens={{ childrenGap: 12 }}>
                  <Dropdown
                    label="Tipo de Vacaciones"
                    selectedKey={selectedSolicitud.tipoVacaciones}
                    options={[
                      { key: 'libres', text: 'Libres' },
                      { key: 'bloque', text: 'Bloque' },
                    ]}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      dropdown: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                  <TextField
                    label="Días Solicitados"
                    value={selectedSolicitud.diasSolicitados.toString()}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                  <Dropdown
                    label="Estado"
                    selectedKey={selectedSolicitud.estado}
                    options={[
                      { key: 'pendiente', text: 'Pendiente' },
                      { key: 'aprobado', text: 'Aprobado' },
                      { key: 'rechazado', text: 'Rechazado' },
                      { key: 'cancelado', text: 'Cancelado' },
                    ]}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      dropdown: { 
                        backgroundColor: '#f8f9fa',
                        color: getEstadoColor(selectedSolicitud.estado),
                        fontWeight: '600',
                      },
                    }}
                  />
                  <TextField
                    label="Aprobado/Rechazado por"
                    value={selectedSolicitud.nombreAprobador || 'Pendiente de gestión'}
                    disabled
                    styles={{
                      root: { width: '100%' },
                      fieldGroup: { backgroundColor: '#f8f9fa' },
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* Segunda fila: Fechas en 2x2 grid */}
            <Stack tokens={{ childrenGap: 16 }}>
              <Text variant="large" styles={{ root: { fontWeight: '600', color: '#323130', borderBottom: '2px solid #0078d4', paddingBottom: '8px' } }}>
                Información de Fechas
              </Text>
              <Stack 
                horizontal 
                wrap 
                tokens={{ childrenGap: 20 }}
                styles={{
                  root: {
                    '@media (max-width: 768px)': {
                      flexDirection: 'column',
                    }
                  }
                }}
              >
                <Stack 
                  horizontal 
                  wrap 
                  tokens={{ childrenGap: 20 }}
                  styles={{ 
                    root: { 
                      flex: '1 1 420px',
                      '@media (max-width: 768px)': {
                        flexDirection: 'column',
                      }
                    } 
                  }}
                >
                  <Stack styles={{ root: { flex: '1 1 190px', minWidth: '180px' } }}>
                    <TextField
                      label="Fecha de Inicio"
                      value={formatDate(selectedSolicitud.fechaInicio)}
                      disabled
                      styles={{
                        root: { width: '100%' },
                        fieldGroup: { backgroundColor: '#f0f8ff' },
                      }}
                    />
                  </Stack>
                  <Stack styles={{ root: { flex: '1 1 190px', minWidth: '180px' } }}>
                    <TextField
                      label="Fecha de Fin"
                      value={formatDate(selectedSolicitud.fechaFin)}
                      disabled
                      styles={{
                        root: { width: '100%' },
                        fieldGroup: { backgroundColor: '#f0f8ff' },
                      }}
                    />
                  </Stack>
                </Stack>
                <Stack 
                  horizontal 
                  wrap 
                  tokens={{ childrenGap: 20 }}
                  styles={{ 
                    root: { 
                      flex: '1 1 420px',
                      '@media (max-width: 768px)': {
                        flexDirection: 'column',
                      }
                    } 
                  }}
                >
                  <Stack styles={{ root: { flex: '1 1 190px', minWidth: '180px' } }}>
                    <TextField
                      label="Fecha de Solicitud"
                      value={formatDate(selectedSolicitud.fechaSolicitud)}
                      disabled
                      styles={{
                        root: { width: '100%' },
                        fieldGroup: { backgroundColor: '#f5f5f5' },
                      }}
                    />
                  </Stack>
                  <Stack styles={{ root: { flex: '1 1 190px', minWidth: '180px' } }}>
                    <TextField
                      label="Fecha de Gestión"
                      value={selectedSolicitud.fechaAprobacion ? formatDate(selectedSolicitud.fechaAprobacion) : 'Pendiente'}
                      disabled
                      styles={{
                        root: { width: '100%' },
                        fieldGroup: { backgroundColor: '#f5f5f5' },
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* Tercera fila: Observaciones y Comentarios */}
            {(selectedSolicitud.observaciones || selectedSolicitud.comentarios) && (
              <Stack tokens={{ childrenGap: 16 }}>
                <Text variant="large" styles={{ root: { fontWeight: '600', color: '#323130', borderBottom: '2px solid #0078d4', paddingBottom: '8px' } }}>
                  Observaciones y Comentarios
                </Text>
                <Stack 
                  horizontal 
                  wrap 
                  tokens={{ childrenGap: 24 }}
                  styles={{
                    root: {
                      '@media (max-width: 1024px)': {
                        flexDirection: 'column',
                      }
                    }
                  }}
                >
                  {selectedSolicitud.observaciones && (
                    <Stack 
                      styles={{ 
                        root: { 
                          flex: selectedSolicitud.comentarios ? '1 1 400px' : '1 1 100%', 
                          minWidth: '350px',
                          '@media (max-width: 1024px)': {
                            minWidth: '100%',
                          }
                        } 
                      }}
                    >
                      <TextField
                        label="Observaciones del Solicitante"
                        value={selectedSolicitud.observaciones}
                        multiline
                        rows={4}
                        disabled
                        styles={{
                          root: { width: '100%' },
                          fieldGroup: { 
                            backgroundColor: '#e1f5fe',
                            border: '1px solid #0078d4',
                          },
                        }}
                      />
                    </Stack>
                  )}
                  {selectedSolicitud.comentarios && (
                    <Stack 
                      styles={{ 
                        root: { 
                          flex: selectedSolicitud.observaciones ? '1 1 400px' : '1 1 100%', 
                          minWidth: '350px',
                          '@media (max-width: 1024px)': {
                            minWidth: '100%',
                          }
                        } 
                      }}
                    >
                      <TextField
                        label="Comentarios del Aprobador"
                        value={selectedSolicitud.comentarios}
                        multiline
                        rows={4}
                        disabled
                        styles={{
                          root: { width: '100%' },
                          fieldGroup: { 
                            backgroundColor: '#e8f5e8',
                            border: '1px solid #107c10',
                          },
                        }}
                      />
                    </Stack>
                  )}
                </Stack>
              </Stack>
            )}

            {/* Mensaje cuando no hay observaciones ni comentarios */}
            {!selectedSolicitud.observaciones && !selectedSolicitud.comentarios && (
              <Stack tokens={{ childrenGap: 16 }}>
                <Text variant="large" styles={{ root: { fontWeight: '600', color: '#323130', borderBottom: '2px solid #0078d4', paddingBottom: '8px' } }}>
                  Observaciones y Comentarios
                </Text>
                <Stack 
                  styles={{ 
                    root: { 
                      padding: '24px', 
                      textAlign: 'center', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px dashed #d1d5db',
                    } 
                  }}
                >
                  <Icon 
                    iconName="Comment" 
                    styles={{ 
                      root: { 
                        fontSize: '32px', 
                        color: '#a19f9d', 
                        marginBottom: '8px' 
                      } 
                    }} 
                  />
                  <Text styles={{ root: { color: '#605e5c', fontStyle: 'italic', fontSize: '16px' } }}>
                    No hay observaciones ni comentarios para esta solicitud
                  </Text>
                </Stack>
              </Stack>
            )}
          </Stack>
          </div>
        )}
        <DialogFooter>
          <DefaultButton 
            onClick={() => setShowDetailDialog(false)} 
            text="Cerrar" 
            iconProps={{ iconName: 'Cancel' }}
            styles={{
              root: {
                minWidth: '120px',
                height: '40px',
              }
            }}
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default GestionSolicitudes;

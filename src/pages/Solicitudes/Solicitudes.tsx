import React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
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
  TooltipHost,
  Icon,
  CommandBarButton,
  ContextualMenu,
} from '@fluentui/react';
import type { IColumn, IDropdownOption } from '@fluentui/react';
import { useSolicitudesController } from './Solicitudes.controller';
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
  actionButtonsStyles,
  optimizedModalStyles,
  compactModalStyles,
} from './Solicitudes.styles';
import type { SolicitudVacacionesDto } from '../../services/solicitudVacaciones.service';

const Solicitudes: React.FC = () => {
  const {
    solicitudes,
    solicitudDetail,
    totalSolicitudes,
    isLoading,
    isLoadingDetail,
    isCanceling,
    error,
    successMessage,
    contextMenuVisible,
    contextMenuTarget,
    selectedContextSolicitud,
    currentPage,
    pageSize,
    filters,
    stats,
    loadSolicitudDetail,
    cancelarSolicitud,
    applyFilters,
    changePage,
    clearError,
    clearSuccess,
    navigateToCreate,
    refreshData,
    handleMenuClick,
    getContextMenuItems,
    canCancelSolicitud,
    setContextMenuVisible,
    handleViewDetailFromMenu,
    handleCancelClickFromMenu,
    selectedSolicitud,
    setSelectedSolicitud,
    showDetailDialog,
    setShowDetailDialog,
    showCancelDialog,
    setShowCancelDialog,
    cancelMotivo,
    setCancelMotivo,
    handleCancelConfirm,
    handleCancelDialogClose,
    handleDetailDialogClose,
  } = useSolicitudesController();

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
      onRender: (item: SolicitudVacacionesDto) => {
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
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
          #{item.id}
        </Text>
      ),
    },
    {
      key: 'tipoVacaciones',
      name: 'Tipo',
      fieldName: 'tipoVacaciones',
      minWidth: 80,
      maxWidth: 100,
      isResizable: false,
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
        <Text variant="medium" styles={{ root: { textTransform: 'capitalize' } }}>
          {item.tipoVacaciones}
        </Text>
      ),
    },
    {
      key: 'fechas',
      name: 'Fechas',
      fieldName: 'fechaInicio',
      minWidth: 140,
      maxWidth: 180,
      isResizable: false,
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { fontWeight: '500' } }}>
            {formatDate(item.fechaInicio)}
          </Text>
          <Text variant="small" styles={{ root: { color: '#605e5c', fontSize: '12px' } }}>
            al {formatDate(item.fechaFin)}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'diasSolicitados',
      name: 'Días',
      fieldName: 'diasSolicitados',
      minWidth: 60,
      maxWidth: 80,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
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
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
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
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
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
      data: 'number',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '500' } }}>
          {item.periodo}
        </Text>
      ),
    },
  ];

  const handleFilterChange = (key: string, value: string | undefined) => {
    if (key === 'estado') {
      applyFilters({ estado: value || undefined });
    } else if (key === 'tipoVacaciones') {
      applyFilters({ tipoVacaciones: value || undefined });
    } else if (key === 'periodo') {
      applyFilters({ periodo: value ? parseInt(value) : undefined });
    }
  };

  const clearFilters = () => {
    applyFilters({
      estado: undefined,
      tipoVacaciones: undefined,
      periodo: undefined,
    });
  };

  // Calcular información de paginación
  const totalPages = Math.ceil(totalSolicitudes / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalSolicitudes);

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
          <Text styles={titleStyles}>Mis Solicitudes de Vacaciones</Text>
          <Text styles={subtitleStyles}>
            Gestiona y revisa todas tus solicitudes de vacaciones
          </Text>
        </Stack>
        <PrimaryButton
          iconProps={{ iconName: 'Add' }}
          onClick={navigateToCreate}
          text="Nueva Solicitud"
        />
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
            styles={{ root: { minWidth: 150, width: '100%', maxWidth: 200 } }}
          />
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
            Solicitudes ({totalSolicitudes})
          </Text>
        </Stack>

        {isLoading ? (
          <Stack styles={loadingContainerStyles}>
            <Spinner size={SpinnerSize.large} label="Cargando solicitudes..." />
          </Stack>
        ) : solicitudes.length === 0 ? (
          <Stack styles={emptyStateStyles}>
            <Icon iconName="FolderOpen" style={emptyStateIconStyles} />
            <Text styles={emptyStateTitleStyles}>No hay solicitudes</Text>
            <Text styles={emptyStateMessageStyles}>
              Parece que aún no has creado ninguna solicitud de vacaciones. ¡Crea tu primera solicitud para comenzar!
            </Text>
            <PrimaryButton
              iconProps={{ iconName: 'Add' }}
              text="Crear Primera Solicitud"
              onClick={navigateToCreate}
            />
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
                  setKey="solicitudesVacaciones"
                  onShouldVirtualize={() => false}
                />
              </div>
            </Stack>

            {/* Paginación */}
            {totalPages > 1 && (
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                styles={paginationContainerStyles}
              >
                <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
                  Mostrando {startItem}-{endItem} de {totalSolicitudes} solicitudes
                </Text>
                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                  <IconButton
                    iconProps={{ iconName: 'ChevronLeft' }}
                    title="Página anterior"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                  />
                  <Text>{currentPage} de {totalPages}</Text>
                  <IconButton
                    iconProps={{ iconName: 'ChevronRight' }}
                    title="Página siguiente"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                  />
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Stack>

      {/* Dialog para cancelar solicitud */}
      <Dialog
        hidden={!showCancelDialog}
        onDismiss={handleCancelDialogClose}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Cancelar Solicitud',
          subText: selectedSolicitud
            ? `¿Estás seguro de que deseas cancelar la solicitud #${selectedSolicitud.id}?`
            : '',
        }}
        modalProps={{
          isBlocking: true,
          styles: compactModalStyles,
        }}
      >
        <TextField
          label="Motivo de cancelación"
          multiline
          rows={3}
          value={cancelMotivo}
          onChange={(_, newValue) => setCancelMotivo(newValue || '')}
          placeholder="Ingresa el motivo por el cual deseas cancelar esta solicitud..."
          required
        />
        <DialogFooter>
          <PrimaryButton
            onClick={handleCancelConfirm}
            text="Cancelar Solicitud"
            disabled={!cancelMotivo.trim() || isCanceling}
          />
          <DefaultButton onClick={handleCancelDialogClose} text="Cerrar" />
        </DialogFooter>
      </Dialog>

      {/* Dialog para ver detalle */}
      <Dialog
        hidden={!showDetailDialog}
        onDismiss={handleDetailDialogClose}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Detalle de Solicitud',
          subText: solicitudDetail
            ? `Solicitud #${solicitudDetail.id} - ${solicitudDetail.nombreSolicitante}`
            : '',
        }}
        modalProps={{
          isBlocking: false,
          styles: optimizedModalStyles,
        }}
      >
        {isLoadingDetail ? (
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Spinner size={SpinnerSize.medium} label="Cargando detalle..." />
          </Stack>
        ) : solicitudDetail ? (
          <Stack tokens={{ childrenGap: 16 }}>
            <Stack horizontal tokens={{ childrenGap: 32 }}>
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
                  Información General
                </Text>
                <Text><strong>Tipo:</strong> {solicitudDetail.tipoVacaciones}</Text>
                <Text><strong>Días solicitados:</strong> {solicitudDetail.diasSolicitados}</Text>
                <Text><strong>Estado:</strong> {solicitudDetail.estado}</Text>
                <Text><strong>Período:</strong> {solicitudDetail.periodo}</Text>
              </Stack>
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
                  Fechas
                </Text>
                <Text><strong>Fecha inicio:</strong> {formatDate(solicitudDetail.fechaInicio)}</Text>
                <Text><strong>Fecha fin:</strong> {formatDate(solicitudDetail.fechaFin)}</Text>
                <Text><strong>Fecha solicitud:</strong> {formatDate(solicitudDetail.fechaSolicitud)}</Text>
                {solicitudDetail.fechaAprobacion && (
                  <Text><strong>Fecha gestión:</strong> {formatDate(solicitudDetail.fechaAprobacion)}</Text>
                )}
              </Stack>
            </Stack>
            {solicitudDetail.observaciones && (
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
                  Mis Observaciones
                </Text>
                <Text styles={{ root: { fontStyle: 'italic', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' } }}>
                  {solicitudDetail.observaciones}
                </Text>
              </Stack>
            )}
            {solicitudDetail.comentarios && (
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
                  Comentarios del Aprobador
                </Text>
                <Text styles={{ root: { backgroundColor: '#e8f4fd', padding: '8px', borderRadius: '4px' } }}>
                  {solicitudDetail.comentarios}
                </Text>
              </Stack>
            )}
          </Stack>
        ) : (
          <Text>No se pudo cargar el detalle de la solicitud.</Text>
        )}
        <DialogFooter>
          <DefaultButton onClick={handleDetailDialogClose} text="Cerrar" />
        </DialogFooter>
      </Dialog>

      {/* Menú contextual */}
      {contextMenuVisible && (
        <ContextualMenu
          items={getContextMenuItems(selectedContextSolicitud)}
          hidden={!contextMenuVisible}
          target={contextMenuTarget}
          onItemClick={() => setContextMenuVisible(false)}
          onDismiss={() => setContextMenuVisible(false)}
        />
      )}
    </Stack>
  );
};

export default Solicitudes;

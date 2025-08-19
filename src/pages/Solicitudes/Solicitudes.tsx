import React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  IconButton,
  Dialog,
  DialogType,
  DialogFooter,
  TextField,
  Icon,
  CommandBarButton,
  ContextualMenu,
} from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { DataTable, StatusBadge } from '../../components/DataTable';
import type { DataTableColumn, SortConfig } from '../../components/DataTable';
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
  optimizedModalStyles,
  compactModalStyles,
} from './Solicitudes.styles';
import type { SolicitudVacacionesDetailDto } from '../../services/solicitudVacaciones.service';

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
    sortConfig,
    filters,
    stats,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    navigateToCreate,
    refreshData,
    handleMenuClick,
    getContextMenuItems,
    setContextMenuVisible,
    selectedSolicitud,
    showDetailDialog,
    showCancelDialog,
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

  // Definir las columnas para el DataTable según el orden solicitado:
  // Acciones, Id, Solicitante, Tipo, F. Inicio, F. Fin, Días, Estado, Solicitado, Periodo, Manager, Aprobado Por, F. Gestión
  const columns: DataTableColumn<SolicitudVacacionesDetailDto>[] = [
    {
      key: 'acciones',
      name: 'Acciones',
      fieldName: 'acciones',
      minWidth: 40,
      maxWidth: 45,
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
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'id',
      isSortedDescending: sortConfig?.key === 'id' && sortConfig?.direction === 'descending',
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
      maxWidth: 160,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'solicitante',
      isSortedDescending: sortConfig?.key === 'solicitante' && sortConfig?.direction === 'descending',
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
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'tipoVacaciones',
      isSortedDescending: sortConfig?.key === 'tipoVacaciones' && sortConfig?.direction === 'descending',
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
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'fechaInicio',
      isSortedDescending: sortConfig?.key === 'fechaInicio' && sortConfig?.direction === 'descending',
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
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'fechaFin',
      isSortedDescending: sortConfig?.key === 'fechaFin' && sortConfig?.direction === 'descending',
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
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasSolicitados',
      isSortedDescending: sortConfig?.key === 'diasSolicitados' && sortConfig?.direction === 'descending',
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
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'estado',
      isSortedDescending: sortConfig?.key === 'estado' && sortConfig?.direction === 'descending',
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <StatusBadge status={item.estado} variant="small" />
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
      isSorted: sortConfig?.key === 'fechaSolicitud',
      isSortedDescending: sortConfig?.key === 'fechaSolicitud' && sortConfig?.direction === 'descending',
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
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'periodo',
      isSortedDescending: sortConfig?.key === 'periodo' && sortConfig?.direction === 'descending',
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
      maxWidth: 160,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'manager',
      isSortedDescending: sortConfig?.key === 'manager' && sortConfig?.direction === 'descending',
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
          {item.nombreJefeDirecto || 'Sin asignar'}
        </Text>
      ),
    },
    {
      key: 'aprobadoPor',
      name: 'Aprobado Por',
      fieldName: 'nombreAprobador',
      minWidth: 120,
      maxWidth: 160,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'aprobadoPor',
      isSortedDescending: sortConfig?.key === 'aprobadoPor' && sortConfig?.direction === 'descending',
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
          {item.nombreAprobador || '-'}
        </Text>
      ),
    },
    {
      key: 'fechaGestion',
      name: 'F. Gestión',
      fieldName: 'fechaAprobacion',
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'fechaGestion',
      isSortedDescending: sortConfig?.key === 'fechaGestion' && sortConfig?.direction === 'descending',
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
          {item.fechaAprobacion ? formatDate(item.fechaAprobacion) : '-'}
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
          <Stack styles={tableContainerStyles}>
            <DataTable
              items={solicitudes}
              columns={columns}
              isLoading={isLoading}
              emptyStateTitle="No hay solicitudes"
              emptyStateMessage="No se encontraron solicitudes de vacaciones para mostrar"
              onSort={handleSort}
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalSolicitudes,
                pageSizeOptions: [5, 10, 25, 50],
                itemName: 'solicitudes',
                onPageChange: changePage,
                onPageSizeChange: changePageSize,
              }}
            />
          </Stack>
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

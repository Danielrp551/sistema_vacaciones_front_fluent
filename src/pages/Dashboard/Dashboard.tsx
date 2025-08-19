import React, { useState } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  IconButton,
  ContextualMenu,
  DirectionalHint,
} from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import { DataTable, StatusBadge, formatDate } from '../../components/DataTable';
import type { DataTableColumn } from '../../components/DataTable';
import { useDashboardController } from './Dashboard.controller';
import type { SolicitudVacacionesDetailDto } from '../../services/solicitudVacaciones.service';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
  statsGridStyles,
  statCardStyles,
  statNumberStyles,
  statLabelStyles,
  tableContainerStyles,
  sectionTitleStyles,
} from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const {
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
  } = useDashboardController();

  // Estado para menú contextual
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState<HTMLElement | null>(null);
  const [contextMenuSolicitud, setContextMenuSolicitud] = useState<SolicitudVacacionesDetailDto | null>(null);

  // Manejar click en menú de acciones
  const handleMenuClick = (event: React.MouseEvent<any>, solicitud: SolicitudVacacionesDetailDto) => {
    setContextMenuTarget(event.currentTarget);
    setContextMenuSolicitud(solicitud);
    setContextMenuVisible(true);
  };

  // Obtener elementos del menú contextual
  const getContextMenuItems = (solicitud: SolicitudVacacionesDetailDto | null): IContextualMenuItem[] => {
    if (!solicitud) return [];

    const items: IContextualMenuItem[] = [
      {
        key: 'view',
        text: 'Ver detalles',
        iconProps: { iconName: 'View' },
        onClick: () => {
          console.log('Ver detalles de solicitud:', solicitud.id);
          setContextMenuVisible(false);
        },
      },
    ];

    // Solo agregar opciones de aprobación/rechazo si está pendiente
    if (solicitud.estado.toLowerCase() === 'pendiente') {
      items.push(
        {
          key: 'approve',
          text: 'Aprobar',
          iconProps: { iconName: 'Accept' },
          onClick: () => {
            console.log('Aprobar solicitud:', solicitud.id);
            setContextMenuVisible(false);
          },
        },
        {
          key: 'reject',
          text: 'Rechazar',
          iconProps: { iconName: 'Cancel' },
          onClick: () => {
            console.log('Rechazar solicitud:', solicitud.id);
            setContextMenuVisible(false);
          },
        }
      );
    }

    return items;
  };

  // Definir las columnas exactamente como en GestionSolicitudes
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
      isSorted: sortConfig?.key === 'id',
      isSortedDescending: sortConfig?.key === 'id' && sortConfig.direction === 'descending',
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
      data: 'string',
      isPadded: true,
      onRender: (item: SolicitudVacacionesDetailDto) => (
        <StatusBadge status={item.estado} variant="small" />
      ),
    },
  ];

  return (
    <>
      <Stack styles={containerStyles} tokens={{ childrenGap: 24 }}>
        {/* Header */}
        <Stack styles={headerStyles}>
          <Text styles={titleStyles}>Dashboard Principal</Text>
          <Text styles={subtitleStyles}>
            Bienvenido al sistema de gestión de vacaciones
          </Text>
        </Stack>

        {/* Mensaje de error */}
        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            dismissButtonAriaLabel="Cerrar"
            onDismiss={() => {}}
          >
            {error}
          </MessageBar>
        )}

        {/* Estadísticas */}
        <Stack horizontal tokens={{ childrenGap: 16 }} styles={statsGridStyles} wrap>
          <Stack styles={statCardStyles}>
            <Text styles={statNumberStyles}>{stats.total}</Text>
            <Text styles={statLabelStyles}>Total</Text>
          </Stack>
          <Stack styles={statCardStyles}>
            <Text styles={statNumberStyles} style={{ color: '#d83b01' }}>{stats.pendientes}</Text>
            <Text styles={statLabelStyles}>Pendientes</Text>
          </Stack>
          <Stack styles={statCardStyles}>
            <Text styles={statNumberStyles} style={{ color: '#107c10' }}>{stats.aprobadas}</Text>
            <Text styles={statLabelStyles}>Aprobadas</Text>
          </Stack>
          <Stack styles={statCardStyles}>
            <Text styles={statNumberStyles} style={{ color: '#d13438' }}>{stats.rechazadas}</Text>
            <Text styles={statLabelStyles}>Rechazadas</Text>
          </Stack>
          <Stack styles={statCardStyles}>
            <Text styles={statNumberStyles} style={{ color: '#605e5c' }}>{stats.canceladas}</Text>
            <Text styles={statLabelStyles}>Canceladas</Text>
          </Stack>
        </Stack>

        {/* Acciones rápidas */}
        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <PrimaryButton text="Nueva Solicitud" iconProps={{ iconName: 'Add' }} />
          <PrimaryButton text="Ver Historial" iconProps={{ iconName: 'History' }} />
          <PrimaryButton 
            text="Actualizar" 
            iconProps={{ iconName: 'Refresh' }} 
            onClick={refreshData}
            disabled={isLoading}
          />
        </Stack>

        {/* Tabla de solicitudes recientes */}
        <Stack tokens={{ childrenGap: 16 }}>
          <Text styles={sectionTitleStyles}>Solicitudes del Equipo</Text>
          
          <Stack styles={tableContainerStyles}>
            <DataTable
              items={solicitudes}
              columns={columns}
              isLoading={isLoading}
              emptyStateTitle="No hay solicitudes"
              emptyStateMessage="No se encontraron solicitudes de vacaciones para mostrar"
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalCompleto,
                pageSizeOptions: [5, 10, 25, 50],
                itemName: 'solicitudes',
                onPageChange: changePage,
                onPageSizeChange: changePageSize,
              }}
              onSort={handleSort}
            />
          </Stack>
        </Stack>
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
    </>
  );
};

export default Dashboard;

// ============================================================================
// PÁGINA DE GESTIÓN DE ROLES
// ============================================================================
// Página principal para administrar roles del sistema con interfaz completa
// de CRUD, filtros, paginación y auditoría usando Fluent UI
// ============================================================================

import React, { useState } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
  Icon,
  IconButton,
  TooltipHost,
  Pivot,
  PivotItem,
  SearchBox,
  SelectionMode,
} from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn } from '../../components/DataTable';
import { HistorialAuditoria } from '../../components/auditoria';
import { Snackbar } from '../../components/Common/Snackbar';
import { PermisoModal } from '../../components/GestionPermisos';
import type { PermisoModalMode } from '../../components/GestionPermisos';
import { useSnackbar } from '../../hooks/useSnackbar';
import { usePermisosAdmin } from '../../hooks/usePermisosAdmin';
import type { Permiso } from '../../types/permisos';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
  filtersContainerStyles,
  filterRowStyles,
  filterItemStyles,
  statsGridStyles,
  statCardStyles,
  statNumberStyles,
  statLabelStyles,
  tableContainerStyles,
  loadingContainerStyles,
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateMessageStyles,
  auditTabStyles,
} from './GestionPermisos.styles';
//import { PermisoModal } from '../../components/GestionPermisos';
//import { EstadoPermisoModal } from '../../components/GestionPermisos/EstadoPermisoModal/EstadoPermisoModal';


const GestionPermisos: React.FC = () => {
  // Hook para Snackbar
  const { snackbar, hideSnackbar } = useSnackbar();

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<string>('roles');

  const {
    // Estado de datos
    permisos,
    loading: isLoading,
    totalCount,
    currentPage,
    pageSize,
    estadisticas,
    searchTerm,
    sortBy,
    isDescending,
    
    // Funciones
    loadPermisos,
    setSearchTerm,
    changeSorting,
    changePage,
    changePageSize,
    clearFilters
  } = usePermisosAdmin();

  // Estado para el modal de permisos
  const [modal, setModal] = useState<{
    isOpen: boolean;
    mode: PermisoModalMode;
    permisoId?: string;
  }>({
    isOpen: false,
    mode: 'create'
  });

  // Funciones para manejar el modal
  const openCreateModal = () => {
    setModal({ isOpen: true, mode: 'create' });
  };

  const openEditModal = (permisoId: string) => {
    setModal({ isOpen: true, mode: 'edit', permisoId });
  };

  const openViewModal = (permisoId: string) => {
    setModal({ isOpen: true, mode: 'view', permisoId });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'create' });
  };

  const handleModalSuccess = () => {
    loadPermisos(); // Recargar la lista de permisos
  };

  // Configuración de columnas para la tabla
  const columns: DataTableColumn<Permiso>[] = [
    {
      key: 'acciones',
      name: 'Acciones',
      fieldName: '',
      minWidth: 60,
      maxWidth: 60,
      isResizable: false,
      isSortable: false,
      onRender: (item: Permiso) => {
        const menuItems: IContextualMenuItem[] = [
          {
            key: 'view',
            text: 'Ver detalles',
            iconProps: { iconName: 'View' },
            onClick: () => openViewModal(item.id),
          },
          {
            key: 'edit',
            text: 'Editar',
            iconProps: { iconName: 'Edit' },
            onClick: () => openEditModal(item.id),
          },
        ];

        return (
          <TooltipHost content="Acciones">
            <IconButton
              iconProps={{ iconName: 'MoreVertical' }}
              menuIconProps={{ iconName: '' }}
              menuProps={{ 
                items: menuItems,
                directionalHint: 6 // DirectionalHint.rightTopEdge
              }}
              ariaLabel="Menú de acciones"
              styles={{
                root: {
                  height: '32px',
                  width: '32px',
                },
                menuIcon: {
                  fontSize: '16px',
                }
              }}
            />
          </TooltipHost>
        );
      },
    },
    {
      key: 'nombre',
      name: 'Permiso',
      fieldName: 'nombre',
      minWidth: 150,
      maxWidth: 170,
      isResizable: true,
      isSorted: sortBy === 'nombre',
      isSortedDescending: isDescending,
      onColumnClick: () => changeSorting('nombre', !isDescending),
    },
    {
      key: 'modulo',
      name: 'Módulo',
      fieldName: 'modulo',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: sortBy === 'modulo',
      isSortedDescending: isDescending,
      onColumnClick: () => changeSorting('modulo', !isDescending),
    },
    {
      key: 'numeroRoles',
      name: 'Roles Asignados',
      fieldName: 'numeroRoles',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: sortBy === 'numeroRoles',
      isSortedDescending: isDescending,
      onColumnClick: () => changeSorting('numeroRoles', !isDescending),
    }
  ];

  // Renderizado del contenido principal de roles
  const renderRolesContent = () => {
    if (isLoading) {
      return (
        <Stack styles={loadingContainerStyles}>
          <Spinner size={SpinnerSize.large} label="Cargando permisos..." />
        </Stack>
      );
    }

    if (permisos.length === 0) {
      return (
        <Stack styles={emptyStateStyles}>
          <Icon iconName="Permissions" styles={emptyStateIconStyles} />
          <Text styles={emptyStateTitleStyles}>No hay permisos registrados</Text>
          <Text styles={emptyStateMessageStyles}>
            Comience creando el primer permiso del sistema
          </Text>
          <PrimaryButton
            text="Crear Primer Permiso"
            iconProps={{ iconName: 'Add' }}
            onClick={() => {/* TODO: implementar */}}
            styles={{ root: { marginTop: '16px' } }}
          />
        </Stack>
      );
    }

    return (
      <DataTable
        items={permisos}
        columns={columns}
        onSort={(columnKey, isSortedDescending) => changeSorting(columnKey, isSortedDescending ?? false)}
        pagination={{
          currentPage,
          pageSize,
          totalItems: totalCount,
          onPageChange: changePage,
          onPageSizeChange: changePageSize,
          itemName: 'permisos'
        }}
        isLoading={isLoading}
        selectionMode={SelectionMode.none}
      />
    );
  };

  // Cálculo de estadísticas
  const permisosActivos = permisos.filter(permiso => permiso.isActive).length;

  return (
    <Stack styles={containerStyles}>
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" styles={headerStyles}>
        <Stack>
          <Text styles={titleStyles}>Gestión de Permisos</Text>
          <Text styles={subtitleStyles}>
            Administre los permisos del sistema
          </Text>
        </Stack>
      </Stack>

      {/* Pestañas */}
      <Pivot
        selectedKey={activeTab}
        onLinkClick={(item) => setActiveTab(item?.props.itemKey || 'roles')}
        headersOnly
        getTabId={(itemKey) => `tab-${itemKey}`}
      >
        <PivotItem headerText="Permisos" itemKey="roles" itemIcon="SecurityGroup" />
        <PivotItem headerText="Auditoría" itemKey="auditoria" itemIcon="History" />
      </Pivot>

      {/* Contenido de las pestañas */}
      {activeTab === 'roles' && (
        <>
          {/* Estadísticas */}
          <Stack horizontal tokens={{ childrenGap: 16 }} styles={statsGridStyles}>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{totalCount}</Text>
              <Text styles={statLabelStyles}>Total Permisos</Text>
            </Stack>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{permisosActivos}</Text>
              <Text styles={statLabelStyles}>Permisos Activos</Text>
            </Stack>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{estadisticas?.totalModulos || 0}</Text>
              <Text styles={statLabelStyles}>Módulos</Text>
            </Stack>
          </Stack>

          {/* Botones de acción */}
          <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginBottom: '16px' } }}>
            <DefaultButton
              text="Actualizar"
              iconProps={{ iconName: 'Refresh' }}
              onClick={() => loadPermisos()}
              disabled={isLoading}
              styles={{
                root: {
                  minWidth: '100px',
                  height: '32px',
                },
                icon: {
                  fontSize: '14px',
                }
              }}
            />
            <PrimaryButton
              text="Nuevo Permiso"
              iconProps={{ iconName: 'Add' }}
              onClick={() => openCreateModal()}
              styles={{
                root: {
                  minWidth: '120px',
                  height: '32px',
                },
                icon: {
                  fontSize: '14px',
                }
              }}
            />
          </Stack>

          {/* Filtros */}
          <Stack styles={filtersContainerStyles}>
            <Stack horizontal wrap tokens={{ childrenGap: 16 }} styles={filterRowStyles}>
              <Stack styles={filterItemStyles}>
                <SearchBox
                  placeholder="Buscar por nombre..."
                  value={searchTerm || ''}
                  onChange={(_, newValue) => setSearchTerm(newValue || '')}
                  onClear={() => setSearchTerm('')}
                />
              </Stack>
              <Stack styles={filterItemStyles}>
                <DefaultButton
                  text="Limpiar Filtros"
                  iconProps={{ iconName: 'ClearFilter' }}
                  onClick={clearFilters}
                  disabled={!searchTerm}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Tabla de roles */}
          <Stack styles={tableContainerStyles}>
            {renderRolesContent()}
          </Stack>
        </>
      )}

      {/* Tab de Auditoría */}
      {activeTab === 'auditoria' && (
        <Stack styles={auditTabStyles}>
          <HistorialAuditoria 
            modulo="GESTION_PERMISOS"
            tablaAfectada="Permisos"
            titulo="Auditoría de Gestión de Permisos"
            mensajesVacios={{
              titulo: "No hay registros de auditoría",
              mensaje: "No se encontraron acciones realizadas en la gestión de permisos"
            }}
          />
        </Stack>
      )}

      {/* Modal de Permiso (Crear/Editar/Ver) */}
      <PermisoModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        permisoId={modal.permisoId}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
      />

      {/* Notificaciones */}
      {/* TODO: Implementar sistema de notificaciones para permisos
      {notification.show && (
        <MessageBar
          messageBarType={
            notification.type === 'success' ? MessageBarType.success :
            notification.type === 'error' ? MessageBarType.error :
            notification.type === 'warning' ? MessageBarType.warning :
            MessageBarType.info
          }
          onDismiss={closeNotification}
          dismissButtonAriaLabel="Cerrar"
          styles={{
            root: {
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              maxWidth: '400px',
            }
          }}
        >
          {notification.message}
        </MessageBar>
      )}
      */}

      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={hideSnackbar}
      />
    </Stack>
  );
};

export default GestionPermisos;
